import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://krha.kr"),
  title: {
    default: "Kiryong Ha | Meta Principal Engineer · Capacity & AI Infrastructure",
    template: "%s | Kiryong Ha",
  },
  description:
    "Kiryong Ha (하기룡) is a Principal Engineer at Meta focused on hyperscale private-cloud capacity management, capacity fulfillment, AI infrastructure, distributed systems, and edge computing.",
  keywords: [
    "Kiryong Ha",
    "하기룡",
    "Meta Principal Engineer",
    "capacity management",
    "capacity fulfillment",
    "AI infrastructure",
    "private cloud",
    "distributed systems",
    "Flux",
    "Taiji",
    "throughput autoscaling",
    "live traffic load testing",
    "edge computing",
    "cloudlet",
  ],
  authors: [{ name: "Kiryong Ha", url: "https://krha.kr/" }],
  creator: "Kiryong Ha",
  category: "Technology",
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: "/",
    siteName: "Kiryong Ha",
    title: "Kiryong Ha | Capacity & AI Infrastructure at Hyperscale",
    description:
      "Meta Principal Engineer specializing in private-cloud capacity management, capacity fulfillment, AI infrastructure, and distributed systems.",
    locale: "en_US",
    images: [
      {
        url: "/og.png",
        width: 1730,
        height: 909,
        alt: "Kiryong Ha, Principal Engineer at Meta",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kiryong Ha | Capacity & AI Infrastructure at Hyperscale",
    description:
      "Meta Principal Engineer specializing in private-cloud capacity management, capacity fulfillment, AI infrastructure, and distributed systems.",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  other: {
    "profile:first_name": "Kiryong",
    "profile:last_name": "Ha",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={manrope.variable}>
      <body>{children}</body>
    </html>
  );
}
