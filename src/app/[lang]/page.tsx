import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calculator, Download, Landmark, MapPin } from "lucide-react";
import { AppShowcase } from "@/components/home/app-showcase";
import { AwarenessPopup } from "@/components/home/awareness-popup";
import { Counters } from "@/components/home/counters";
import { Hero } from "@/components/home/hero";
import { NewsTicker } from "@/components/home/news-ticker";
import { Reveal } from "@/components/home/reveal";
import { ServiceCards } from "@/components/home/service-cards";
import { about, site } from "@/lib/content";
import { tx } from "@/lib/i18n/translate-text";
import { getPageContext } from "@/lib/i18n/page";

export default async function HomePage() {
  const { lang, t } = await getPageContext();
  const quick = [
    { href: `/${lang}/branches`, label: t.branches.title, Icon: MapPin },
    { href: `/${lang}/emi-calculator`, label: t.emi.title, Icon: Calculator },
    { href: `/${lang}/downloads`, label: t.downloads.title, Icon: Download },
    { href: `/${lang}/deposit/interest-rates`, label: t.nav.deposit, Icon: Landmark },
  ];
  const collage = [11, 7, 8, 12];

  return (
    <>
      <AwarenessPopup labels={{ title: t.home.popupTitle, close: t.home.popupClose }} />
      <Hero lang={lang} t={t} />

      {/* Quick links */}
      <section aria-label={t.home.quick} className="relative z-10 mx-auto max-w-7xl px-2 pt-6 sm:px-4">
        <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {quick.map(({ href, label, Icon }, i) => (
            <Reveal as="li" key={href} delay={i * 80}>
              <Link href={href} className="surface surface-hover group flex items-center gap-3 rounded-2xl p-3 sm:p-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand text-gold shadow-md transition group-hover:bg-[#1d1d1d] group-hover:text-gold sm:size-11"><Icon className="size-5" aria-hidden /></span>
                <span className="text-sm font-semibold leading-tight sm:text-base">{label}</span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* About */}
      <section className="mx-auto grid max-w-7xl items-center gap-8 px-2 py-14 sm:px-4 sm:py-20 lg:grid-cols-2 lg:gap-12">
        <Reveal className="relative">
          <div className="surface grid grid-cols-2 gap-3 rounded-[2rem] p-3">
            {collage.map((n, i) => (
              <div key={n} className={`relative aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-white/60 ${i % 2 ? "sm:translate-y-5" : ""}`}>
                <Image src={`/official/gallery/${n}.webp`} alt="" fill sizes="(min-width:1024px) 25vw, 45vw" className="object-cover transition duration-500 hover:scale-105" />
              </div>
            ))}
          </div>
          <div className="surface-dark absolute left-1/2 top-1/2 grid size-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-center text-white sm:size-32">
            <div>
              <p className="text-xs uppercase tracking-wider text-gold">{t.home.since}</p>
              <p className="text-2xl font-extrabold leading-none sm:text-3xl">1959</p>
            </div>
          </div>
        </Reveal>
        <Reveal delay={150} className="surface rounded-[2rem] p-6 sm:p-9">
          <p className="eyebrow">{t.home.aboutSub}</p>
          <h2 className="mt-4 text-2xl font-bold leading-tight text-brand sm:text-3xl lg:text-4xl">{t.meta.siteName}</h2>
          <p lang={lang} className="mt-4 text-justify leading-loose text-neutral-700">{tx(about.history[0], lang)}</p>
          {t.home.aboutNote && <p className="mt-2 text-xs text-muted-foreground">{t.home.aboutNote}</p>}
          <Link href={`/${lang}/about`} className="mt-6 inline-flex items-center gap-2 rounded-md bg-brand px-6 py-3 font-semibold text-gold transition hover:bg-[#1d1d1d] hover:text-gold">
            {t.common.learnMore} <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Reveal>
      </section>

      <NewsTicker lang={lang} t={t} />

      <AppShowcase
        sub={t.home.mobileSub}
        titleA={t.home.mobileTitleA}
        titleB={t.home.mobileTitleB}
        text={t.home.mobileText}
        features={t.home.appFeatures}
      />

      <Counters
        title={t.home.strength}
        year={site.counterYear}
        items={site.counters.map((c) => ({
          key: c.key,
          label: t.home.counters[c.key as keyof typeof t.home.counters],
          value: c.value,
          unit: t.home.lakh,
          icon: c.icon,
        }))}
      />

      <ServiceCards lang={lang} t={t} />
    </>
  );
}
