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

## Technology

- React 19 and TypeScript
- [vinext](https://github.com/cloudflare/vinext) and Vite
- Responsive, hand-authored CSS with Manrope typography
- Cloudflare Worker-compatible deployment through Sites

## Local development

Node.js 22.13 or newer is required.

```bash
git clone git@github.com:krha/krha-web.git
cd krha-web
npm install
npm run dev
```

The development server prints the local preview URL when it starts.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Create a production build |
| `npm test` | Build the site and validate the rendered HTML |
| `npm run lint` | Run the code-quality checks |
| `npm start` | Run the production build locally |

## Project structure

| Path | Purpose |
| --- | --- |
| `app/page.tsx` | Homepage content and section structure |
| `app/globals.css` | Site-wide visual design and responsive styles |
| `app/layout.tsx` | Page metadata, social previews, and search metadata |
| `public/` | Profile image, social image, favicon, sitemap, and crawler files |
| `tests/` | Rendered-page validation |
| `.openai/hosting.json` | Sites deployment configuration |

The production site is available at [krha.kr](https://krha.kr/).
