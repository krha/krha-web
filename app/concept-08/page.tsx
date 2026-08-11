import type { Metadata } from "next";
import ConceptPreview from "../concept-preview";

export const metadata: Metadata = {
  title: "Concept 08 · Indexed Infrastructure Brief",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ConceptPreview id="08" />;
}
