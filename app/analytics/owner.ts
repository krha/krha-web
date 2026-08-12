import { env } from "cloudflare:workers";
import type { ChatGPTUser } from "../chatgpt-auth";

export function isAnalyticsOwner(
  user: Pick<ChatGPTUser, "userId" | "email">,
): boolean {
  const configuredIds = (env.ANALYTICS_OWNER_IDS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  if (configuredIds.includes(user.userId.trim())) return true;

  // Email is retained only as a local-development fallback. Production uses
  // the stable Sites account ID so address changes cannot alter authorization.
  const configuredEmails =
    env.ANALYTICS_OWNER_EMAILS ?? process.env.ANALYTICS_OWNER_EMAILS ?? "";
  const allowed = configuredEmails
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  return allowed.includes(user.email.trim().toLowerCase());
}
