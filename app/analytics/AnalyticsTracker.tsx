"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  ANALYTICS_OPT_OUT_KEY,
  canonicalOutboundDestination,
  categorizeReferrerHostname,
  isTrackedPage,
  OUTBOUND_GROUPS,
  TRACKED_SECTION_IDS,
  type AnalyticsPayload,
  type OutboundGroup,
  type TrackedSectionId,
  type ViewportClass,
} from "./model";

declare global {
  interface Navigator {
    globalPrivacyControl?: boolean;
  }
}

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!isTrackedPage(pathname) || shouldSkipAnalytics(pathname)) return;

    sendAnalytics({
      type: "pageview",
      path: pathname,
      referrer: getReferrerCategory(),
      language: navigator.language ?? "",
      viewport: getViewportClass(),
    });

    const handleClick = (event: MouseEvent) => {
      if (shouldSkipAnalytics()) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest<HTMLAnchorElement>("a[href]");
      if (!link) return;

      const section = link.dataset.analyticsSection;
      if (isTrackedSection(section)) {
        sendAnalytics({
          type: "event",
          name: "section_navigation",
          value: section,
        });
      }

      const group = link.dataset.analyticsOutbound;
      if (!isOutboundGroup(group)) return;

      try {
        const destination = canonicalOutboundDestination(
          new URL(link.href).hostname,
          group,
        );
        if (!destination) return;
        sendAnalytics({
          type: "event",
          name: "outbound_click",
          value: destination,
          group,
        });
      } catch {
        // Invalid links are ignored; analytics must never affect navigation.
      }
    };

    document.addEventListener("click", handleClick, { capture: true });

    const viewedSections = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        if (shouldSkipAnalytics()) return;
        for (const entry of entries) {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.25) continue;
          const section = entry.target.id;
          if (!isTrackedSection(section) || viewedSections.has(section)) continue;
          viewedSections.add(section);
          sendAnalytics({ type: "event", name: "section_view", value: section });
          observer.unobserve(entry.target);
        }
      },
      { threshold: [0.25] },
    );

    for (const sectionId of TRACKED_SECTION_IDS) {
      const sectionHeading = document.getElementById(sectionId);
      if (sectionHeading) observer.observe(sectionHeading);
    }

    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}

export function shouldSkipAnalytics(pathname = window.location.pathname): boolean {
  if (!isTrackedPage(pathname) || hasBrowserPrivacySignal()) {
    return true;
  }

  try {
    return window.localStorage.getItem(ANALYTICS_OPT_OUT_KEY) === "1";
  } catch {
    // If the browser cannot persist a choice, favor privacy over measurement.
    return true;
  }
}

export function hasBrowserPrivacySignal(): boolean {
  return (
    navigator.globalPrivacyControl === true ||
    navigator.doNotTrack === "1" ||
    navigator.doNotTrack === "yes"
  );
}

function sendAnalytics(payload: AnalyticsPayload) {
  if (shouldSkipAnalytics()) return;
  const body = JSON.stringify(payload);
  const blob = new Blob([body], { type: "text/plain;charset=UTF-8" });

  if (navigator.sendBeacon?.("/api/analytics", blob)) return;

  void fetch("/api/analytics", {
    method: "POST",
    body,
    headers: { "content-type": "text/plain;charset=UTF-8" },
    credentials: "same-origin",
    keepalive: true,
  }).catch(() => {
    // Analytics is best-effort and must never interrupt the visitor.
  });
}

function getReferrerCategory() {
  if (!document.referrer) return categorizeReferrerHostname("");
  try {
    const referrer = new URL(document.referrer);
    return categorizeReferrerHostname(
      referrer.origin === window.location.origin ? "krha.kr" : referrer.hostname,
    );
  } catch {
    return categorizeReferrerHostname(null);
  }
}

function getViewportClass(): ViewportClass {
  if (window.innerWidth < 640) return "compact";
  if (window.innerWidth < 1024) return "medium";
  return "wide";
}

function isTrackedSection(value: string | undefined): value is TrackedSectionId {
  return TRACKED_SECTION_IDS.some((section) => section === value);
}

function isOutboundGroup(value: string | undefined): value is OutboundGroup {
  return OUTBOUND_GROUPS.some((group) => group === value);
}
