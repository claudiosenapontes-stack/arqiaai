import type { Metadata } from "next";
import { Playfair_Display, Inter, Montserrat } from "next/font/google";
import "./globals.css";

const serif = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "ARQIA — Architectural Intelligence",
    template: "%s · ARQIA",
  },
  description: "Architectural Intelligence for refined spaces.",
  openGraph: {
    title: "ARQIA — Architectural Intelligence",
    description: "Architectural Intelligence for refined spaces.",
    url: "/",
    siteName: "ARQIA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ARQIA — Architectural Intelligence",
    description: "Architectural Intelligence for refined spaces.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${montserrat.variable}`}>
      <body className="font-sans antialiased bg-arqia-white text-arqia-ink">
        {children}
      </body>
    </html>
  );
}
