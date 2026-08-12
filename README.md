# krha.kr

Source code for [krha.kr](https://krha.kr/), the personal website of Kiryong Ha
(하기룡). The site presents his work in hyperscale private-cloud capacity
management, capacity fulfillment, distributed systems, and edge computing.

## What the site covers

- Professional background and current focus
- Career history
- Selected public work in capacity management, traffic engineering, and
  autoscaling
- Peer-reviewed publications
- Selected patents and talks
- Privacy-preserving, aggregate visitor analytics

## Technology

- React 19 and TypeScript
- [vinext](https://github.com/cloudflare/vinext) and Vite
- Responsive, hand-authored CSS with Manrope typography
- Cloudflare Worker-compatible deployment through Sites
- First-party aggregate counters in Sites D1

## Local development

Node.js 22.13 or newer is required.

```bash
git clone git@github.com:krha/krha-web.git
cd krha-web
npm install
cp .env.example .env.local
npm run dev
```

Set `ANALYTICS_OWNER_EMAILS` in `.env.local` to the ChatGPT account email that
may open the private `/analytics` dashboard during local development. Production
uses the owner's stable account ID in `ANALYTICS_OWNER_IDS`, managed in Sites and
never committed. The development server prints the local preview URL when it
starts.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Create a production build |
| `npm test` | Build the site and validate the rendered HTML |
| `npm run lint` | Run the code-quality checks |
| `npm run db:generate` | Generate a D1 migration after an analytics schema change |
| `npm run verify:release` | Confirm local, GitHub, and live-site commits match |
| `npm start` | Run the production build locally |

## Release synchronization

GitHub [`krha/krha-web`](https://github.com/krha/krha-web) on `main` is the
canonical source. A public release is complete only after the same commit has
been pushed to GitHub and deployed through Sites. Project-level release rules
in `AGENTS.md` require Codex to stop rather than deploy when those commits do
not match.

Production builds publish the deployed source commit at
[`https://krha.kr/site-version.json`](https://krha.kr/site-version.json). After
a deployment, verify all three copies with:

```bash
npm run verify:release
```

The command fails if the local checkout, GitHub `main`, or the live site refers
to a different commit.

## Project structure

| Path | Purpose |
| --- | --- |
| `app/page.tsx` | Homepage content and section structure |
| `app/globals.css` | Site-wide visual design and responsive styles |
| `app/layout.tsx` | Page metadata, social previews, and search metadata |
| `app/analytics/` | Aggregate tracker, private dashboard, and reporting logic |
| `app/privacy/` | Public analytics and hosting privacy notice |
| `app/api/analytics/` | Same-origin endpoint for aggregate counters |
| `db/` and `drizzle/` | Aggregate-only D1 schema and migrations |
| `public/` | Profile image, social image, favicon, sitemap, and crawler files |
| `tests/` | Rendered-page validation |
| `.openai/hosting.json` | Sites deployment configuration |

The production site is available at [krha.kr](https://krha.kr/).

## Analytics privacy model

The site records only aggregate daily counters for page paths, fixed referring
categories, coarse audience categories, section engagement, and a fixed list of
outbound destinations. It intentionally stores no event log, visitor or session ID, raw IP
address, raw user agent, query string, full referrer URL, form content, or
session replay. Global Privacy Control, Do Not Track, and the on-site opt-out
are honored. The dashboard combines audience categories with fewer than three
views and is restricted to the configured owner account.
