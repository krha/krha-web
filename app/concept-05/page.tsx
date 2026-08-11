import type { Metadata } from "next";
import ConceptPreview from "../concept-preview";

export const metadata: Metadata = {
  title: "Concept 05 · Executive Index",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ConceptPreview id="05" />;
}
