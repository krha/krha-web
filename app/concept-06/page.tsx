import type { Metadata } from "next";
import ConceptPreview from "../concept-preview";

export const metadata: Metadata = {
  title: "Concept 06 · Systems Ledger",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ConceptPreview id="06" />;
}
