import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") || host.startsWith("127.0.0.1")
      ? "http"
      : "https");
  const metadataBase = new URL(`${protocol}://${host}`);
  const title = "Manabu — Học tiếng Nhật theo cụm";
  const description =
    "Lộ trình 50 bài Minna no Nihongo với Cloze, xếp câu, nghe chép và đọc tương tác.";
  const socialImage = new URL("/og.png", metadataBase).toString();

  return {
    metadataBase,
    title,
    description,
    openGraph: {
      title: "Manabu — Học theo cụm. Nói thành câu.",
      description,
      type: "website",
      images: [{ url: socialImage, width: 1672, height: 941, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Manabu — Học theo cụm. Nói thành câu.",
      description,
      images: [socialImage],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
