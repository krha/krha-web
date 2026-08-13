import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireChatGPTUser, chatGPTSignOutPath } from "../chatgpt-auth";
import { isAnalyticsOwner } from "./owner";
import {
  getAnalyticsReport,
  type AnalyticsReport,
  type BreakdownItem,
} from "./report";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: { absolute: "Kiryong Ha - Analytics" },
  robots: { index: false, follow: false, noarchive: true, nosnippet: true },
};

const ALLOWED_RANGES = [7, 30, 90] as const;

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams?: Promise<{ days?: string }>;
}) {
  const user = await requireChatGPTUser("/analytics");
  if (!isAnalyticsOwner(user)) notFound();

  const requestedDays = Number((await searchParams)?.days ?? "30");
  const days = ALLOWED_RANGES.includes(requestedDays as 7 | 30 | 90)
    ? requestedDays
    : 30;
  const report = await getAnalyticsReport(days);

  return (
    <main className="analytics-shell">
      <header className="analytics-header">
        <div>
          <p className="eyebrow">Private · aggregate-only</p>
          <h1>krha.kr analytics</h1>
          <p>
            Audience trends without visitor IDs, raw IP addresses, or individual
            browsing histories.
          </p>
        </div>
        <nav aria-label="Analytics account actions">
          <Link href="/">View site</Link>
          <a href={chatGPTSignOutPath("/")}>Sign out</a>
        </nav>
      </header>

      <div className="analytics-range" aria-label="Report range">
        {ALLOWED_RANGES.map((range) => (
          <a
            key={range}
            href={`/analytics?days=${range}`}
            aria-current={days === range ? "page" : undefined}
          >
            {range} days
          </a>
        ))}
      </div>

      <p className="analytics-period">
        {report.startDate} – {report.endDate} · dates and hours use UTC
      </p>

      <section className="metric-grid" aria-label="Summary metrics">
        <Metric label="Page views" value={formatNumber(report.totalPageviews)} />
        <Metric
          label="Prior-period change"
          value={formatChange(report.pageviewChange, report.previousPageviews)}
        />
        <Metric label="Meaningful interactions" value={formatNumber(report.totalInteractions)} />
        <Metric
          label="Most viewed page"
          value={report.pages[0]?.value ?? "No data yet"}
        />
      </section>

      <section className="analytics-panel analytics-trend" aria-labelledby="daily-trend">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Traffic</p>
            <h2 id="daily-trend">Daily page views</h2>
          </div>
          <p>{formatNumber(report.totalPageviews)} total</p>
        </div>
        <DailyBars report={report} />
      </section>

      <div className="analytics-grid">
        <Breakdown title="Top pages" items={report.pages} />
        <Breakdown title="Referring categories" items={report.referrers} />
        <Breakdown title="Countries" items={report.countries} />
        <Breakdown title="Devices" items={report.devices} />
        <Breakdown title="Browsers" items={report.browsers} />
        <Breakdown title="Operating systems" items={report.operatingSystems} />
        <Breakdown title="Languages" items={report.languages} />
        <Breakdown title="Viewport sizes" items={report.viewports} />
        <Breakdown title="Hours (UTC)" items={report.hours} />
        <Breakdown title="Outbound destinations" items={report.outboundDestinations} />
        <Breakdown title="Outbound link groups" items={report.outboundGroups} />
        <Breakdown title="Sections viewed" items={report.sectionViews} />
        <Breakdown title="Section navigation" items={report.sectionNavigation} />
      </div>

      <section className="analytics-panel analytics-notes" aria-labelledby="measurement-notes">
        <h2 id="measurement-notes">How to read this</h2>
        <ul>
          <li>Page views are requests from browsers that allow aggregate analytics, not unique people.</li>
          <li>Privacy tools and content blockers can reduce the totals.</li>
          <li>Every breakdown combines values with fewer than three observations instead of exposing a one-person category.</li>
          <li>Use trends and content interest for decisions; do not interpret these counters as named visitor profiles.</li>
        </ul>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <article className="metric-card">
      <p>{label}</p>
      <strong>{value}</strong>
    </article>
  );
}

function DailyBars({ report }: { report: AnalyticsReport }) {
  const max = Math.max(...report.daily.map((item) => item.count), 1);
  const visibleLabelEvery = report.days > 30 ? 14 : report.days > 7 ? 7 : 1;

  return (
    <div className="daily-bars" role="img" aria-label="Daily page views bar chart">
      {report.daily.map((item, index) => {
        const height = item.count === 0 ? 3 : Math.max(8, (item.count / max) * 100);
        return (
          <div className="daily-column" key={item.date} title={`${item.date}: ${item.count}`}>
            <span
              className="daily-count"
              style={{ "--bar-height": `${height}%` } as CSSProperties}
            />
            <small>{index % visibleLabelEvery === 0 ? item.date.slice(5) : ""}</small>
          </div>
        );
      })}
    </div>
  );
}

function Breakdown({
  title,
  items,
}: {
  title: string;
  items: BreakdownItem[];
}) {
  const max = Math.max(...items.map((item) => item.count), 1);
  return (
    <section className="analytics-panel breakdown-panel">
      <div className="panel-heading">
        <h2>{title}</h2>
        <span title="Values with fewer than three observations are combined">3+ threshold</span>
      </div>
      {items.length === 0 ? (
        <p className="empty-state">No data yet</p>
      ) : (
        <ol className="breakdown-list">
          {items.map((item) => (
            <li key={item.value}>
              <div>
                <span>{displayValue(item.value)}</span>
                <strong>{formatNumber(item.count)}</strong>
              </div>
              <span className="breakdown-meter" aria-hidden="true">
                <span style={{ width: `${(item.count / max) * 100}%` }} />
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function displayValue(value: string): string {
  if (value === "/") return "Homepage";
  if (value.startsWith("/")) return value;
  if (/^[A-Z]{2}$/.test(value)) return value;
  if (/^[a-z]{2,3}$/.test(value)) return value.toUpperCase();
  return value
    .replaceAll("_", " ")
    .replace(/^\w/, (character) => character.toUpperCase());
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatChange(change: number | null, previous: number): string {
  if (change === null) return previous === 0 ? "New baseline" : "—";
  const rounded = Math.round(change);
  return `${rounded > 0 ? "+" : ""}${rounded}%`;
}
