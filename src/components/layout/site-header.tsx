import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/content/dictionaries/en";
import { navGroups } from "@/lib/site-map";
import { documents, branches } from "@/lib/content";
import { LanguageSwitcher } from "./language-switcher";
import { MainNav, type NavData } from "./main-nav";
import { SearchDialog, type SearchEntry } from "./search-dialog";
import { TopBar } from "./top-bar";

export function SiteHeader({ lang, t }: { lang: Locale; t: Dictionary }) {
  const nav: NavData = {
    home: { href: `/${lang}`, label: t.nav.home },
    groups: navGroups.map((g) => ({
      key: g.key,
      label: t.group[g.key],
      items: g.items.map((i) => ({ href: `/${lang}${i.path}`, label: i.label[lang] })),
    })),
    contact: { href: `/${lang}/contact`, label: t.nav.contact },
  };

  const index: SearchEntry[] = [
    ...navGroups.flatMap((g) =>
      g.items.map((i) => ({
        kind: "page" as const,
        title: i.label[lang],
        alt: i.label[lang === "gu" ? "en" : "gu"],
        href: `/${lang}${i.path}`,
      })),
    ),
    { kind: "page", title: t.nav.contact, alt: "Contact Us", href: `/${lang}/contact` },
    ...[...documents.forms, ...documents.lockerForms, ...documents.schemeForms].map((d) => ({
      kind: "doc" as const,
      title: d.title,
      alt: "",
      href: d.url,
    })),
    ...documents.annualReports.map((d) => ({ kind: "doc" as const, title: d.title, alt: "", href: d.url })),
    ...branches.map((b) => ({
      kind: "branch" as const,
      title: b.name,
      alt: `${b.address} ${b.pincode} ${b.ifsc}`,
      href: `/${lang}/branches?q=${encodeURIComponent(b.name)}`,
    })),
  ];

  return (
    <>
      <TopBar t={t} />
      <header className="sticky top-0 z-40 px-2 pt-2 sm:px-4 sm:pt-3">
        <div className="surface-dark mx-auto flex max-w-7xl items-center justify-between gap-1 rounded-2xl px-2 py-2 text-white min-[400px]:px-3 sm:gap-3 sm:px-4">
          <Link href={`/${lang}`} className="flex min-w-0 shrink-0 items-center gap-3" aria-label={t.meta.siteName}>
            <Image src="/official/brand/logo.png" alt="" width={684} height={292} priority className="h-[clamp(3.4rem,19vw,5.3rem)] w-auto rounded-lg bg-white sm:h-[4.5rem] lg:h-16 xl:h-20" />
            <span className="hidden max-w-[14rem] text-[13px] font-semibold leading-tight 2xl:block">{t.meta.siteName}</span>
          </Link>
          <MainNav nav={nav} menuLabel={t.nav.menu} />
          <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2 lg:ml-0">
            <div className="hidden lg:block"><SearchDialog entries={index} t={t} /></div>
            <LanguageSwitcher lang={lang} label={t.nav.language} />
          </div>
        </div>
      </header>
    </>
  );
}
