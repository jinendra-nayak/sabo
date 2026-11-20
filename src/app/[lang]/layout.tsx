import { ScrollProgress } from "@/components/layout/scroll-progress";
import { QuickDock } from "@/components/layout/quick-dock";
import type { Metadata } from "next";
import { lang as langParam } from "next/root-params";
import "../globals.css";
import { DM_Sans, Noto_Sans_Gujarati } from "next/font/google";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { isLocale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap" });
const gujarati = Noto_Sans_Gujarati({ subsets: ["gujarati"], variable: "--font-gujarati", display: "swap" });

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const lang = await langParam();
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang);
  return {
    title: { default: t.meta.siteName, template: `%s | ${t.meta.shortName}` },
    description: t.meta.description,
    icons: { icon: "/official/brand/logo.png" },
  };
}

export default async function LangLayout({ children }: LayoutProps<"/[lang]">) {
  const lang = await langParam();
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);

  return (
    <html lang={lang} className={`${dmSans.variable} ${gujarati.variable} h-full antialiased`}>
      <body suppressHydrationWarning className="flex min-h-full flex-col text-foreground">
        <noscript>
          <style>{`.reveal{opacity:1!important}`}</style>
        </noscript>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-[60] focus:rounded focus:bg-brand focus:px-4 focus:py-2 focus:font-semibold focus:text-gold"
        >
          {t.top.skip}
        </a>
        <SiteHeader lang={lang} t={t} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter lang={lang} t={t} />
        <QuickDock lang={lang} t={t} />
        <ScrollProgress label={t.dock.top} />
      </body>
    </html>
  );
}
