import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const serif = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "ARQIA",
    template: "%s · ARQIA",
  },
  description: "Architectural Intelligence for refined spaces.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ARQIA",
    description: "Architectural Intelligence for refined spaces.",
    url: "/",
    siteName: "ARQIA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ARQIA",
    description: "Architectural Intelligence for refined spaces.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body className="font-sans antialiased bg-arqia-white text-arqia-ink">
        {children}
      </body>
    </html>
  );
}
