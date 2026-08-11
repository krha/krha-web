export const concepts = [
  {
    id: "01",
    name: "Graphite Dossier",
    description: "Dark identity cover, wide paper sheets, and slim edge tabs.",
  },
  {
    id: "02",
    name: "Technical Ledger",
    description: "A charcoal profile rail paired with precise ledger rows.",
  },
  {
    id: "03",
    name: "Offset Field Notes",
    description: "Subtly staggered archive sheets with warm case-file details.",
  },
  {
    id: "04",
    name: "Slate Dossier",
    description: "A restrained dark masthead and compact editorial sheets.",
  },
  {
    id: "05",
    name: "Executive Index",
    description: "Executive briefing panels with a numbered navigation rail.",
  },
  {
    id: "06",
    name: "Systems Ledger",
    description: "A continuous reading canvas with an editorial index column.",
  },
  {
    id: "07",
    name: "Executive Field File",
    description: "A high-contrast cover followed by crisp technical records.",
  },
  {
    id: "08",
    name: "Indexed Infrastructure Brief",
    description: "Dark technical rail with a dedicated section-index column.",
  },
  {
    id: "09",
    name: "Blueprint Folio",
    description: "Blueprint accents, engineering-grid gutters, and paper folios.",
  },
  {
    id: "10",
    name: "Staggered Case File",
    description: "Alternating dossier sheets with strong document labels.",
  },
] as const;

export type ConceptId = (typeof concepts)[number]["id"];
