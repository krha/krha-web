# Website review notes

Reviewed: 2026-08-10

## Existing-site audit

The live `https://krha.kr/` endpoint currently presents an invalid, self-signed TLS certificate and could not be opened by a normal browser. Search engines and AI crawlers are likely to have the same trust problem until the certificate and hosting path are corrected.

The most recent accessible public copy was inspected through the Internet Archive. It is a Bootstrap-era academic site last updated around 2015. Its main positioning is “Ph.D. student at Carnegie Mellon University,” and its navigation is About, Publications, Research, CV, and GitHub. Its strengths are a substantive publication list and a clear early research history. Its primary gaps are:

- current identity and Meta role are absent;
- the content leads with 2013–2015 cloudlet work rather than current private-cloud capacity work;
- important public Meta work—Taiji, throughput autoscaling, live traffic load testing, and Flux—is absent;
- titles and descriptions are generic, with little topic-specific SEO;
- there is no Person structured data, canonical metadata, sitemap, or AI-readable summary;
- old HTTP dependencies and the current certificate failure prevent reliable discovery.

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
- **Current email, downloadable CV, and portrait** — omitted because no current approved assets or contact details were supplied. The archived 2015 portrait was reviewed but is not used.

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
