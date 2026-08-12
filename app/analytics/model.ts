export const ANALYTICS_OPT_OUT_KEY = "krha.analytics.optOut";
export const ANALYTICS_RETENTION_DAYS = 400;
export const ANALYTICS_EVENTS_PER_MINUTE = 240;
export const SMALL_GROUP_THRESHOLD = 3;
export const TRACKED_PAGE_PATHS = ["/"] as const;

export const TRACKED_SECTION_IDS = [
  "focus",
  "career",
  "work",
  "publications",
  "patents",
] as const;

export const OUTBOUND_GROUPS = [
  "navigation",
  "profile",
  "career",
  "work",
  "publication",
  "patent",
  "talk",
  "privacy",
  "other",
] as const;

export const REFERRER_CATEGORIES = [
  "Direct",
  "Internal",
  "Search",
  "LinkedIn",
  "GitHub",
  "Social",
  "Academic",
  "ChatGPT",
  "Other website",
] as const;

const LANGUAGE_CATEGORIES = [
  "ar",
  "cs",
  "da",
  "de",
  "en",
  "es",
  "fi",
  "fr",
  "he",
  "hi",
  "id",
  "it",
  "ja",
  "ko",
  "nl",
  "no",
  "pl",
  "pt",
  "ru",
  "sv",
  "th",
  "tr",
  "uk",
  "vi",
  "zh",
] as const;

const OUTBOUND_DESTINATION_RULES = [
  { domain: "linkedin.com", groups: ["navigation", "profile", "privacy"] },
  { domain: "github.com", groups: ["profile"] },
  { domain: "usenix.org", groups: ["work", "publication"] },
  { domain: "atscaleconference.com", groups: ["work", "talk"] },
  { domain: "engineering.fb.com", groups: ["work"] },
  { domain: "doi.org", groups: ["work", "publication"] },
  { domain: "kilthub.cmu.edu", groups: ["career", "publication"] },
  { domain: "research.facebook.com", groups: ["career"] },
  { domain: "microsoft.com", groups: ["career"] },
  { domain: "etri.re.kr", groups: ["career"] },
  { domain: "kaist.ac.kr", groups: ["career"] },
  { domain: "dblp.org", groups: ["publication"] },
  { domain: "scholar.google.com", groups: ["publication"] },
  { domain: "patents.justia.com", groups: ["patent"] },
  { domain: "patents.google.com", groups: ["patent"] },
  { domain: "cmu.edu", groups: ["talk"] },
  { domain: "openai.com", groups: ["privacy"] },
  { domain: "developers.cloudflare.com", groups: ["privacy"] },
] as const satisfies ReadonlyArray<{
  domain: string;
  groups: readonly OutboundGroup[];
}>;

export type TrackedSectionId = (typeof TRACKED_SECTION_IDS)[number];
export type OutboundGroup = (typeof OUTBOUND_GROUPS)[number];
export type ReferrerCategory = (typeof REFERRER_CATEGORIES)[number];
export type OutboundDestination =
  (typeof OUTBOUND_DESTINATION_RULES)[number]["domain"];
export type ViewportClass = "compact" | "medium" | "wide" | "unknown";

export type AnalyticsPayload =
  | {
      type: "pageview";
      path: (typeof TRACKED_PAGE_PATHS)[number];
      referrer: ReferrerCategory;
      language: string;
      viewport: ViewportClass;
    }
  | {
      type: "event";
      name: "outbound_click";
      value: OutboundDestination;
      group: OutboundGroup;
    }
  | {
      type: "event";
      name: "section_view" | "section_navigation";
      value: TrackedSectionId;
    };

const SAFE_PATH = /^\/[a-z0-9/_-]{0,79}$/;
const SAFE_HOSTNAME = /^(?:[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?\.)*[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$/;
const SAFE_LANGUAGE = /^[a-z]{2,3}$/;

export function parseAnalyticsPayload(value: unknown): AnalyticsPayload | null {
  if (!isRecord(value) || typeof value.type !== "string") return null;

  if (value.type === "pageview") {
    const path = cleanPath(value.path);
    const referrer = REFERRER_CATEGORIES.find(
      (category) => category === value.referrer,
    );
    const language = cleanLanguage(value.language);
    const viewport = cleanViewport(value.viewport);
    if (
      !path ||
      !isTrackedPage(path) ||
      !referrer
    ) {
      return null;
    }

    return { type: "pageview", path, referrer, language, viewport };
  }

  if (value.type !== "event" || typeof value.name !== "string") return null;

  if (value.name === "outbound_click") {
    const group = OUTBOUND_GROUPS.find((item) => item === value.group);
    const destination = canonicalOutboundDestination(value.value, group);
    if (!destination || !group) return null;
    return { type: "event", name: value.name, value: destination, group };
  }

  if (value.name === "section_view" || value.name === "section_navigation") {
    const section = TRACKED_SECTION_IDS.find((item) => item === value.value);
    if (!section) return null;
    return { type: "event", name: value.name, value: section };
  }

  return null;
}

export function cleanPath(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const path = value.trim().toLowerCase();
  if (!SAFE_PATH.test(path) || path.includes("//")) return null;
  return path || "/";
}

export function cleanHostname(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const hostname = value.trim().toLowerCase().replace(/\.$/, "");
  if (
    !hostname ||
    hostname.length > 253 ||
    !hostname.includes(".") ||
    !SAFE_HOSTNAME.test(hostname) ||
    /^\d{1,3}(?:\.\d{1,3}){3}$/.test(hostname)
  ) {
    return null;
  }
  return hostname;
}

export function categorizeReferrerHostname(value: unknown): ReferrerCategory {
  if (value === "") return "Direct";
  const hostname = cleanHostname(value);
  if (!hostname) return "Other website";

  if (hostMatchesDomain(hostname, "krha.kr")) return "Internal";
  if (
    matchesAnyDomain(hostname, [
      "scholar.google.com",
      "dblp.org",
      "acm.org",
      "ieee.org",
      "researchgate.net",
      "semanticscholar.org",
      "usenix.org",
    ])
  ) {
    return "Academic";
  }
  if (
    matchesAnyDomain(hostname, [
      "google.com",
      "google.co.kr",
      "bing.com",
      "duckduckgo.com",
      "naver.com",
      "daum.net",
      "yahoo.com",
      "baidu.com",
      "yandex.com",
      "brave.com",
      "ecosia.org",
    ])
  ) {
    return "Search";
  }
  if (hostMatchesDomain(hostname, "linkedin.com")) return "LinkedIn";
  if (hostMatchesDomain(hostname, "github.com")) return "GitHub";
  if (
    matchesAnyDomain(hostname, [
      "facebook.com",
      "instagram.com",
      "threads.net",
      "twitter.com",
      "x.com",
    ])
  ) {
    return "Social";
  }
  if (matchesAnyDomain(hostname, ["chatgpt.com", "openai.com"])) {
    return "ChatGPT";
  }
  return "Other website";
}

export function canonicalOutboundDestination(
  value: unknown,
  group: OutboundGroup | undefined,
): OutboundDestination | null {
  const hostname = cleanHostname(value);
  if (!hostname || !group) return null;

  const rule = OUTBOUND_DESTINATION_RULES.find(
    (candidate) =>
      hostMatchesDomain(hostname, candidate.domain) &&
      candidate.groups.some((allowedGroup) => allowedGroup === group),
  );
  return rule?.domain ?? null;
}

export function cleanLanguage(value: unknown): string {
  if (typeof value !== "string") return "Other";
  const language = value.trim().toLowerCase().split("-")[0];
  if (!SAFE_LANGUAGE.test(language)) return "Other";
  return LANGUAGE_CATEGORIES.some((candidate) => candidate === language)
    ? language
    : "Other";
}

export function isTrackedPage(value: string): value is (typeof TRACKED_PAGE_PATHS)[number] {
  return TRACKED_PAGE_PATHS.some((path) => path === value);
}

export function retentionStartDate(now: Date): string {
  const boundary = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
  boundary.setUTCDate(boundary.getUTCDate() - (ANALYTICS_RETENTION_DAYS - 1));
  return boundary.toISOString().slice(0, 10);
}

function cleanViewport(value: unknown): ViewportClass {
  return value === "compact" || value === "medium" || value === "wide"
    ? value
    : "unknown";
}

function matchesAnyDomain(hostname: string, domains: readonly string[]): boolean {
  return domains.some((domain) => hostMatchesDomain(hostname, domain));
}

function hostMatchesDomain(hostname: string, domain: string): boolean {
  return hostname === domain || hostname.endsWith(`.${domain}`);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
