# Website review notes

Reviewed: 2026-08-10

## Existing-site audit

The live `http://krha.kr/` site was inspected directly. It uses a Bootstrap 3-era academic layout: a fixed light navbar, circular portrait and section links in a narrow left column, a wider right content column, a light-gray “What's New!” well, and a dark footer. This revision intentionally keeps that recognizable structure and visual language while updating typography, spacing, responsive behavior, content, and discovery metadata.

The existing public copy still describes Kiryong Ha as a “Research Scientist at Facebook,” and its news ends in 2017. Its strengths are a substantive publication list, a clear early research history, and a simple information-first layout. Its primary gaps are:

- current identity and Meta role are absent;
- the content leads with 2013–2015 cloudlet work rather than current private-cloud capacity work;
- important public Meta work—Taiji, throughput autoscaling, live traffic load testing, and Flux—is absent;
- titles and descriptions are generic, with little topic-specific SEO;
- there is no Person structured data, canonical metadata, sitemap, or AI-readable summary;
- old HTTP dependencies and the current HTTPS certificate failure prevent reliable discovery.

The `https://krha.kr/` endpoint currently presents an invalid, self-signed TLS certificate. Search engines and AI crawlers are likely to have the same trust problem until the certificate and hosting path are corrected.

## Claim approval checklist

The website distinguishes public-source claims from statements supplied directly by the profile owner.

### Included, but owner approval is required before public custom-domain launch

- **“Principal Engineer (E8)”** — Principal Engineer is supported by the public LinkedIn profile. The E8 mapping is an owner-provided statement and was not found in an official public Meta source.
- **Current capacity-fulfillment and AI-infrastructure scope** — owner-provided. It is written in first person and intentionally avoids confidential project names, internal metrics, or non-public architecture.
- **ETRI and KAIST dates** — reconstructed from the archived owner website and CMU biography. Confirm the exact dates and degree naming.

### Deliberately not published

- **“Top 1%” / E8 rarity** — no official public Meta source was found. Do not add a percentile until an acceptable source and exact wording are approved.
- **“Top 10 in the world,” “world-leading expert,” or similar ranking** — not independently verifiable and therefore omitted. The site demonstrates expertise through specific public systems, scale, and roles instead.
- **Exact Meta start date and internal reporting scope** — omitted because a current public source was not verified.
- **Current email and downloadable CV** — omitted because no current approved contact details or updated CV were supplied.
- **Portrait** — the portrait already published on `http://krha.kr/` is reused in the revised site. Replace it if a newer approved headshot is preferred.

### Public-source wording constraints

- Flux is described as a public system spanning thousands of services, tens of regions, and millions of servers. Those figures describe the system, not Kiryong Ha’s individual ownership.
- The OSDI 2023 paper acknowledges Kiryong Ha as a Flux team member in 2023. The site does not claim that this alone proves current 2026 team membership.
- The current live site’s TLS/certificate issue should be fixed before pointing `krha.kr` at the new deployment.

## Discovery features included

- server-rendered semantic HTML and meaningful heading structure;
- descriptive title, meta description, canonical URL, Open Graph, and X metadata;
- Schema.org `Person` JSON-LD with verified identity links and topic expertise;
- `robots.txt`, `sitemap.xml`, and `llms.txt`;
- consistent use of “Kiryong Ha” and “하기룡” for entity resolution;
- explicit disambiguation in `llms.txt` from the similarly named chemical-engineering professor;
- direct primary-source links for selected engineering work, publications, talks, and patents.
