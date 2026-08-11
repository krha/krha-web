import type { Metadata } from "next";
import Home from "../page";
import "../design-previews.css";

export const metadata: Metadata = {
  title: "Design 15 Preview | Kiryong Ha",
  robots: { index: false, follow: false },
};

export default function Design15Preview() {
  return (
    <div className="design-preview design-preview--15">
      <Home />
    </div>
  );
}
