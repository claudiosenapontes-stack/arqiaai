import fs from "node:fs";
import path from "node:path";
import Script from "next/script";
import { SiteHeader } from "@/components/SiteHeader";

// Read firm home assets at build time so the page is a single SSG output.
const dataDir = path.join(process.cwd(), "src", "data");
const bodyHtml = fs.readFileSync(path.join(dataDir, "home-content.html"), "utf-8");
const styleCss = fs.readFileSync(path.join(dataDir, "home-styles.css"), "utf-8");
const scriptJs = fs.readFileSync(path.join(dataDir, "home-script.js"), "utf-8");

export default function FirmHome() {
  return (
    <>
      <SiteHeader overlay />

      {/* Firm-home scoped CSS (no body{} overrides — the nav was stripped). */}
      <style dangerouslySetInnerHTML={{ __html: styleCss }} />

      {/* Firm marketing content (hero, projects, services, digital, furniture, contact). */}
      <div className="firm-home" dangerouslySetInnerHTML={{ __html: bodyHtml }} />

      {/* Scroll/animation behavior preserved from the original page. */}
      <Script id="firm-home-script" strategy="afterInteractive">
        {scriptJs}
      </Script>
    </>
  );
}
