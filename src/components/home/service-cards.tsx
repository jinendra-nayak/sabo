import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/content/dictionaries/en";
import { Reveal } from "./reveal";

const cards = [
  { key: "locker", path: "/service/safe-deposit-lockers", photo: "service-locker", icon: "icon-locker" },
  { key: "draft", path: "/service/demand-draft", photo: "service-draft", icon: "icon-order" },
  { key: "loan", path: "/loans/loan-interest-rate", photo: "service-loan", icon: "icon-loan" },
  { key: "neft", path: "/service/rtgs-neft", photo: "service-neft", icon: "icon-neft" },
] as const;

export function ServiceCards({ lang, t }: { lang: Locale; t: Dictionary }) {
  return (
    <section className="py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-2 sm:px-4">
        <div className="text-center"><p className="eyebrow">{t.home.ourServices}</p></div>
        <h2 className="mt-4 text-center text-3xl font-bold text-brand md:text-4xl">{t.home.specialServices}</h2>
        <ul className="svc-rail mt-10 -mx-2 flex snap-x snap-mandatory gap-5 overflow-x-auto px-2 pb-6 pt-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
          {cards.map((c, idx) => {
            const d = t.home.serviceCards[c.key];
            return (
              <Reveal as="li" key={c.key} delay={idx * 100} className="w-[78%] shrink-0 snap-center sm:w-auto">
                <article className="svc-card group relative flex h-full flex-col rounded-[1.75rem] bg-white/80 p-3 shadow-[0_1px_2px_rgba(23,44,29,.06),0_14px_30px_-18px_rgba(37,69,46,.45)] ring-1 ring-black/5 backdrop-blur transition duration-500 hover:-translate-y-2 hover:shadow-[0_24px_44px_-18px_rgba(37,69,46,.55)]">
                  <div className="relative overflow-hidden rounded-[1.25rem] bg-[#25452e] from-[#2f5a3a] via-[#25452e] to-[#16291c]">
                    <div className="svc-shine pointer-events-none absolute inset-0" aria-hidden />
                    <div className="svc-float relative aspect-[717/404]">
                      <Image src={`/official/icons/${c.photo}.png`} alt="" fill sizes="(min-width:1024px) 25vw, 50vw" className="object-contain transition duration-700 group-hover:scale-105" />
                    </div>
                    <span className="absolute right-3 top-3 grid size-11 place-items-center rounded-xl bg-brand-dark shadow-lg ring-1 ring-gold/60 transition duration-500 group-hover:rotate-6 group-hover:scale-110">
                      <span aria-hidden className="size-6 bg-gold" style={{ WebkitMask: `url(/official/icons/${c.icon}.png) center / contain no-repeat`, mask: `url(/official/icons/${c.icon}.png) center / contain no-repeat` }} />
                    </span>
                    <span className="absolute left-4 top-3 text-xs font-bold tracking-widest text-white/50">0{idx + 1}</span>
                  </div>
                  <div className="flex flex-1 flex-col px-3 pb-3 pt-5">
                    <h3 className="text-lg font-semibold">
                      <Link href={`/${lang}${c.path}`} className="after:absolute after:inset-0 after:rounded-[1.75rem] hover:text-brand">{d.title}</Link>
                    </h3>
                    <p className="mt-2 line-clamp-4 flex-1 text-sm leading-relaxed text-neutral-600">{d.text}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand">
                      <span className="relative after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:w-0 after:bg-gold after:transition-all after:duration-300 group-hover:after:w-full">{t.common.readMore}</span>
                      <ArrowRight className="size-4 transition group-hover:translate-x-1.5" aria-hidden />
                    </span>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
