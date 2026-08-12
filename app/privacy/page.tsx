import type { Metadata } from "next";
import Link from "next/link";
import { PrivacyControls } from "../analytics/PrivacyControls";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How krha.kr handles limited aggregate visitor analytics.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <header className="legal-navbar">
        <Link href="/">Kiryong Ha <span>(하기룡)</span></Link>
      </header>

      <main className="legal-shell">
        <p className="eyebrow">Last updated August 13, 2026</p>
        <h1>Privacy at krha.kr</h1>
        <p className="legal-lead">
          This personal site uses a small, first-party analytics system to
          understand which content is useful. It measures aggregate audience
          trends; it does not build named or persistent visitor profiles.
        </p>

        <PrivacyControls />

        <section>
          <h2>What the analytics system counts</h2>
          <ul>
            <li>Page path, with query strings and fragments excluded</li>
            <li>A fixed referring category such as Search, LinkedIn, GitHub, Academic, or Other; the raw referring hostname is not sent or stored</li>
            <li>Coarse country, browser, operating-system, device, language, and viewport categories</li>
            <li>UTC day and hour</li>
            <li>Section views, section-navigation choices, and destinations selected only from this Site&apos;s fixed outbound-link list</li>
          </ul>
        </section>

        <section>
          <h2>What it does not store</h2>
          <p>
            The analytics database does not store names, email addresses,
            ChatGPT account details, exact IP addresses, raw user-agent strings,
            query strings, full referrer URLs, keystrokes, form content, mouse
            trails, advertising IDs, session replay, or any visitor or session
            identifier. It cannot tell me who a visitor is, where they work, or
            connect their activity across days.
          </p>
        </section>

        <section>
          <h2>How the data is used and retained</h2>
          <p>
            I use these limited counters to understand traffic trends, improve
            navigation, and decide which professional material is most useful.
            Where applicable, I rely on the legitimate interest of understanding
            and improving this professional Site, balanced by data minimization
            and the controls described here.
            The database contains aggregate counts rather than event-level
            records. The system keeps a rolling window of up to 400 days and
            removes older counters when analytics next runs. Categories with
            fewer than three observations are combined in every dashboard
            breakdown to avoid singling out a rare visit. A short-lived,
            site-wide per-minute counter also caps analytics writes during
            unusual traffic; it contains no visitor identifier and is removed
            after about ten minutes of subsequent activity.
          </p>
        </section>

        <section>
          <h2>Your choices</h2>
          <p>
            Analytics does not use cookies. It also stops when your browser sends
            Global Privacy Control or Do Not Track. The control above can save a
            first-party opt-out preference in this browser; that preference is
            used only to prevent analytics collection. The privacy page and the
            private owner dashboard are never measured.
          </p>
        </section>

        <section>
          <h2>Hosting and security</h2>
          <p>
            OpenAI hosts this Site and its aggregate database. OpenAI and its
            infrastructure providers may process operational and security data
            needed to deliver and protect the Site. Cloudflare may set a
            necessary <code>__cf_bm</code> bot-management cookie; it is separate
            from this Site&apos;s analytics system. ChatGPT Sites does not offer
            data-residency controls at launch.
          </p>
          <p>
            See the{" "}
            <a
              href="https://openai.com/policies/chatgpt-sites-terms/"
              target="_blank"
              rel="noreferrer"
              data-analytics-outbound="privacy"
            >
              ChatGPT Sites Terms
            </a>{" "}
            and{" "}
            <a
              href="https://developers.cloudflare.com/fundamentals/reference/policies-compliances/cloudflare-cookies/"
              target="_blank"
              rel="noreferrer"
              data-analytics-outbound="privacy"
            >
              Cloudflare cookie documentation
            </a>
            .
          </p>
        </section>

        <section>
          <h2>Questions</h2>
          <p>
            Kiryong Ha operates krha.kr. For a privacy question, contact me
            through my{" "}
            <a
              href="https://www.linkedin.com/in/kiryong-ha"
              target="_blank"
              rel="noreferrer"
              data-analytics-outbound="privacy"
            >
              public LinkedIn profile
            </a>
            . Depending on where you live, privacy law may provide rights to
            object, complain to a regulator, or ask about personal data. Because
            this analytics database stores no visitor identifier or event-level
            record, it is not possible to retrieve an individual analytics
            history.
          </p>
        </section>

        <Link className="legal-back" href="/">← Back to krha.kr</Link>
      </main>
    </>
  );
}
