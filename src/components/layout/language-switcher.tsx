"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n/config";

const labels: Record<Locale, string> = { gu: "ગુજરાતી", en: "English" };

export function LanguageSwitcher({ lang, label }: { lang: Locale; label: string }) {
  const pathname = usePathname();
  const rest = pathname.replace(/^\/(gu|en)/, "");

  return (
    <div role="group" aria-label={label} className="flex overflow-hidden rounded-full border border-white/30 text-xs sm:text-sm">
      {locales.map((l) => (
        <Link
          key={l}
          href={`/${l}${rest}`}
          hrefLang={l}
          lang={l}
          aria-current={l === lang ? "true" : undefined}
          className={`px-2 py-1.5 transition min-[400px]:px-2.5 sm:px-3 ${l === lang ? "bg-brand-dark font-semibold text-gold shadow-inner" : "text-white hover:bg-white/15"}`}
        >
          {labels[l]}
        </Link>
      ))}
    </div>
  );
}
