import type { Metadata } from "next";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";
import ServiceWorkerRegister from "@/components/shared/ServiceWorkerRegister";
import GoogleTranslateScript from "@/components/shared/GoogleTranslateScript";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "SYNTAXUS — Bharat Heritage & Tourism Atlas | Complete Heritage & Hidden Gems",
  description: "Discover India's sacred monuments, caves, stupas, stepwells, and hidden gems responsibly. An offline-first platform empowering local homestays, hotels, guides, and heritage preservation.",
  keywords: "India, heritage, tourism, monuments, stupas, monasteries, caves, forts, UNESCO, Delhi, West Bengal, Sikkim, Maharashtra, Tamil Nadu, Bihar, Gujarat, Madhya Pradesh, Andhra Pradesh",
  manifest: "/manifest.json",
  openGraph: {
    title: "SYNTAXUS — Bharat Heritage & Tourism Atlas",
    description: "Discover India's uncharted heritage & empower local tourism.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#1B4332" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="icon" href="/icons/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/icon.svg" />
      </head>
      <body className="font-body bg-parchment-50 text-stone-800 antialiased">
        <I18nProvider>
          <ServiceWorkerRegister />
          <GoogleTranslateScript />
          <div className="min-h-screen flex flex-col">
            {children}
          </div>
          <Analytics />
        </I18nProvider>
      </body>
    </html>
  );
}
