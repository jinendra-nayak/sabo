import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";

export function PageHero({
  lang,
  title,
  homeLabel,
  trail = [],
}: {
  lang: Locale;
  title: string;
  homeLabel: string;
  trail?: string[];
}) {
  return (
    <section className="relative mx-2 mt-3 overflow-hidden rounded-3xl bg-gradient-to-br from-brand via-brand to-brand-dark text-white shadow-xl sm:mx-4 lg:mx-auto lg:max-w-7xl">
      <div aria-hidden className="absolute -right-16 -top-16 size-64 rounded-full bg-gold/20" />
      <div aria-hidden className="absolute -bottom-24 left-1/3 size-72 rounded-full bg-white/5" />
      <div className="relative px-5 py-9 sm:px-8 md:py-12">
        <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl">{title}</h1>
        <nav aria-label="Breadcrumb" className="mt-4 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-white/85">
            <li>
              <Link href={`/${lang}`} className="inline-flex items-center gap-1 hover:text-gold">
                <Home className="size-3.5" aria-hidden /> {homeLabel}
              </Link>
            </li>
            {[...trail, title].map((x, i, a) => (
              <li key={x + i} className="flex items-center gap-1.5">
                <ChevronRight className="size-3.5" aria-hidden />
                <span aria-current={i === a.length - 1 ? "page" : undefined} className={i === a.length - 1 ? "text-gold" : ""}>{x}</span>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </section>
  );
}

export function Section({ children, narrow = false }: { children: React.ReactNode; narrow?: boolean }) {
  return <div className={`mx-auto px-3 py-10 sm:px-4 sm:py-12 ${narrow ? "max-w-4xl" : "max-w-7xl"}`}>{children}</div>;
}
