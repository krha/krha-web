import type { Metadata } from "next";
import Link from "next/link";
import { concepts } from "../concept-data";
import "./design-lab.css";

export const metadata: Metadata = {
  title: "Design Lab",
  robots: { index: false, follow: false },
};

export default function DesignLab() {
  return (
    <main className="design-lab">
      <header className="design-lab__header">
        <div>
          <p className="design-lab__eyebrow">Kiryong Ha · Personal Website</p>
          <h1>Design Lab</h1>
          <p>
            Ten variations combining the editorial field-note character of the
            previous design with a stronger technical identity and wider reading
            experience. The content is unchanged in every concept.
          </p>
        </div>
        <Link href="/">View unchanged main page</Link>
      </header>

      <section className="design-lab__grid" aria-label="Design concepts">
        {concepts.map((concept) => (
          <article className="design-card" key={concept.id}>
            <div className="design-card__heading">
              <span>{concept.id}</span>
              <div>
                <h2>{concept.name}</h2>
                <p>{concept.description}</p>
              </div>
            </div>
            <div className="design-card__preview" aria-hidden="true">
              <iframe
                src={`/concept-${concept.id}`}
                title={`${concept.name} preview`}
                loading="lazy"
                tabIndex={-1}
              />
            </div>
            <Link className="design-card__open" href={`/concept-${concept.id}`}>
              Open full-size concept <span aria-hidden="true">↗</span>
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
