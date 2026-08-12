"use client";

import { useEffect, useState } from "react";
import { ANALYTICS_OPT_OUT_KEY } from "./model";

type Preference =
  | "enabled"
  | "disabled"
  | "browser-signal"
  | "unavailable"
  | "unknown";

export function PrivacyControls() {
  const [preference, setPreference] = useState<Preference>("unknown");

  useEffect(() => {
    const timer = window.setTimeout(() => setPreference(readPreference()), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const updatePreference = (disabled: boolean) => {
    try {
      if (disabled) {
        window.localStorage.setItem(ANALYTICS_OPT_OUT_KEY, "1");
      } else {
        window.localStorage.removeItem(ANALYTICS_OPT_OUT_KEY);
      }
      setPreference(disabled ? "disabled" : "enabled");
    } catch {
      setPreference("unavailable");
    }
  };

  const message =
    preference === "browser-signal"
      ? "Analytics is off because your browser sends a privacy signal."
      : preference === "disabled"
        ? "Analytics is off for this browser."
      : preference === "enabled"
          ? "Limited aggregate analytics is currently on for this browser."
          : preference === "unavailable"
            ? "This browser could not save an analytics preference. Use Global Privacy Control or Do Not Track to keep analytics off."
          : "Checking this browser’s preference…";

  return (
    <div className="privacy-controls" aria-live="polite">
      <p>{message}</p>
      {preference !== "browser-signal" ? (
        <div className="privacy-control-actions">
          <button
            type="button"
            disabled={preference === "unknown" || preference === "unavailable"}
            className={preference === "disabled" ? "is-selected" : ""}
            onClick={() => updatePreference(true)}
          >
            Turn analytics off
          </button>
          <button
            type="button"
            disabled={preference === "unknown" || preference === "unavailable"}
            className={preference === "enabled" ? "is-selected" : ""}
            onClick={() => updatePreference(false)}
          >
            Allow aggregate analytics
          </button>
        </div>
      ) : null}
    </div>
  );
}

function readPreference(): Preference {
  if (
    navigator.globalPrivacyControl === true ||
    navigator.doNotTrack === "1" ||
    navigator.doNotTrack === "yes"
  ) {
    return "browser-signal";
  }

  try {
    return window.localStorage.getItem(ANALYTICS_OPT_OUT_KEY) === "1"
      ? "disabled"
      : "enabled";
  } catch {
    return "unavailable";
  }
}
