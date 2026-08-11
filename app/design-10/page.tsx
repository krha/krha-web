import type { Metadata } from "next";
import Home from "../page";
import "../design-previews.css";

export const metadata: Metadata = {
  title: "Design 10 Preview | Kiryong Ha",
  robots: { index: false, follow: false },
};

export default function Design10Preview() {
  return (
    <div className="design-preview design-preview--10">
      <Home />
    </div>
  );
}
