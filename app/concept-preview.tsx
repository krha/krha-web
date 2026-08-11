import Home from "./page";
import type { ConceptId } from "./concept-data";
import "./concept-previews.css";

export default function ConceptPreview({ id }: { id: ConceptId }) {
  return (
    <div className={`concept-page concept-${id}`} data-concept={id}>
      <Home />
    </div>
  );
}
