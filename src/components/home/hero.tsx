"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/content/dictionaries/en";
import { site } from "@/lib/content";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { PhoneMock } from "./phone-mock";

type SlideKey = "education" | "app" | "security" | "rates";
const order: SlideKey[] = ["education", "app", "security", "rates"];

/* ── decorative animated shapes (same visual language as the bank's current hero) ── */
function Shapes({ stars = false }: { stars?: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg className="animate-spin-slow absolute -right-24 top-1/2 size-[520px] -translate-y-1/2 text-[#1a3222] lg:right-[6%]" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="9" strokeDasharray="1.2 0" />
      </svg>
      {stars && <svg className="absolute left-[46%] top-[8%] size-9 text-white/20" viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 2.9 6.9 7.1.6-5.4 4.7 1.7 7.3L12 17.8 5.7 21.5l1.7-7.3L2 9.5l7.1-.6z" /></svg>}
      {stars && <svg className="absolute bottom-[12%] left-[38%] size-6 text-white/20" viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 2.9 6.9 7.1.6-5.4 4.7 1.7 7.3L12 17.8 5.7 21.5l1.7-7.3L2 9.5l7.1-.6z" /></svg>}
      <span className="animate-float absolute bottom-[14%] left-[34%] size-12 rounded-full border-[7px] border-white/10" />
    </div>
  );
}

/* Security slide: the shield-and-hand artwork is the slide background; the left side fades into the hero green so the text stays readable. */
function SecurityBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden bg-[#14291a]">
      <div className="sec-zoom absolute inset-x-0 bottom-0 top-[42%] lg:inset-0">
        <Image src="/official/hero/security-bg-green.png" alt="" fill priority sizes="100vw" className="object-cover [object-position:64%_30%] lg:[object-position:72%_28%]" />
      </div>
      <div className="sec-glow absolute right-[8%] bottom-[8%] size-72 lg:right-[16%] lg:top-[16%] lg:bottom-auto lg:size-[26rem] rounded-full bg-gold/15 blur-3xl" />
      <div className="sec-scan absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-gold/10 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#14291a] from-45% via-[#14291a]/60 to-transparent lg:bg-gradient-to-r lg:from-[#14291a] lg:from-0% lg:via-[#14291a]/60 lg:to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#14291a]/70 to-transparent" />
    </div>
  );
}

/* ── per-slide artwork ── */
function EducationArt() {
  return (
    <div className="animate-float relative">
      <Image src="/official/hero/edu-art.png" alt="" width={355} height={350} unoptimized priority className="h-auto w-[250px] sm:w-[300px] lg:w-[355px]" />
    </div>
  );
}

function RatesArt() {
  return (
    <div className="relative grid size-64 place-items-center sm:size-72">
      <svg className="animate-spin-slow absolute size-full" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="46" stroke="#f7c600" strokeWidth="1.2" strokeDasharray="3 5" />
      </svg>
      <div className="animate-float surface-dark grid size-48 place-items-center rounded-full border-4 !border-gold text-center sm:size-56">
        <div>
          <p className="text-5xl font-extrabold leading-none text-gold sm:text-6xl">7.05<span className="text-3xl">%</span></p>
          <p className="mt-2 text-sm text-white/80">p.a.</p>
        </div>
      </div>
    </div>
  );
}

/** Every slide stays exactly 3 s — an even, continuous rhythm that keeps running wherever the page is scrolled. */
const SLIDE_MS = 3000;

export function Hero({ lang, t }: { lang: Locale; t: Dictionary }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const n = order.length;
  const go = useCallback((d: number) => setI((v) => (v + d + n) % n), [n]);

  const key = order[i];
  const s = t.home.hero[key];
  const cta: Record<SlideKey, { href: string; external?: boolean }> = {
    education: { href: `/${lang}/contact` },
    app: { href: site.external.playStore, external: true },
    security: { href: `/${lang}/know-more/customer-awareness` },
    rates: { href: `/${lang}/deposit/interest-rates` },
  };
  const c = cta[key];
  const text = "text" in s ? s.text : undefined;
  const btn = "inline-flex items-center gap-2 rounded-lg border border-gold/70 bg-brand-dark px-7 py-3.5 text-base font-bold text-gold shadow-lg transition hover:-translate-y-0.5 hover:bg-[#1d1d1d] hover:shadow-xl";

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Highlights"
      className="mt-3 sm:mt-4"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="relative overflow-hidden bg-[#223e2a] shadow-xl">
        {key === "security" ? <SecurityBackdrop key="sec-bg" /> : <Shapes stars={key === "education"} />}
        <div key={key} role="group" aria-roledescription="slide" aria-label={`${i + 1} / ${n}`} className="relative mx-auto grid w-full max-w-7xl min-h-[560px] items-center gap-4 px-6 py-12 sm:px-12 lg:min-h-[480px] lg:grid-cols-[1.1fr_0.9fr] lg:px-20 max-sm:pr-16">
          <div className="max-w-2xl">
            <p className="hero-in text-sm font-bold uppercase tracking-wide text-gold sm:text-base" style={{ animationDelay: "0.05s" }}>{s.eyebrow}</p>
            <h2 className="hero-in mt-3 text-3xl font-bold leading-[1.2] text-white sm:text-4xl lg:text-5xl" style={{ animationDelay: "0.2s" }}>{s.title}</h2>
            {text && <p className="hero-in mt-4 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg" style={{ animationDelay: "0.35s" }}>{text}</p>}
            <div className="hero-in mt-8" style={{ animationDelay: "0.5s" }}>
              {c.external ? (
                <a href={c.href} target="_blank" rel="noopener noreferrer" className={btn}>{s.cta} <ArrowRight className="size-5" aria-hidden /></a>
              ) : (
                <Link href={c.href} className={btn}>{s.cta} <ArrowRight className="size-5" aria-hidden /></Link>
              )}
            </div>
          </div>
          <div className="hero-art-in flex justify-center lg:justify-end">
            {key === "education" && <EducationArt />}
            {key === "app" && <div className="animate-float"><PhoneMock showDots={false} paused={paused} /></div>}
            {key === "rates" && <RatesArt />}
          </div>
        </div>

        <button type="button" onClick={() => go(-1)} aria-label={t.home.prev} className="absolute left-3 top-1/2 z-10 hidden lg:block -translate-y-1/2 rounded-full border border-white/25 bg-black/30 p-2.5 text-white transition hover:bg-[#1d1d1d] hover:text-gold">
          <ChevronLeft className="size-5" />
        </button>
        <button type="button" onClick={() => go(1)} aria-label={t.home.next} className="absolute right-3 top-1/2 z-10 hidden lg:block -translate-y-1/2 rounded-full border border-white/25 bg-black/30 p-2.5 text-white transition hover:bg-[#1d1d1d] hover:text-gold">
          <ChevronRight className="size-5" />
        </button>
        {/* Pagination: segmented progress only (autoplay still pauses on hover / focus) */}
        <div className="absolute inset-x-0 bottom-4 z-10 flex items-center justify-center px-4 sm:bottom-6">
          <div className="flex items-center gap-1.5 sm:gap-2" role="tablist" aria-label={t.home.slide}>
            {order.map((k, idx) => {
              const active = idx === i;
              return (
                <button
                  key={k}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-label={`${t.home.slide} ${idx + 1}`}
                  onClick={() => setI(idx)}
                  className={`group/seg grid h-7 place-items-center transition-[width] duration-500 ease-out ${active ? "w-12 sm:w-16" : "w-6 sm:w-8"}`}
                >
                  <span className="relative block h-[3px] w-full overflow-hidden rounded-full bg-white/25 transition-colors duration-300 group-hover/seg:bg-white/45">
                    <span
                      key={active ? `a${i}` : `s${idx}`}
                      className={`absolute inset-0 origin-left rounded-full ${active ? "hero-seg bg-gold" : idx < i ? "bg-white/70" : "scale-x-0"}`}
                      style={active && !reduced ? { animationDuration: `${SLIDE_MS}ms`, animationPlayState: paused ? "paused" : "running" } : undefined}
                      onAnimationEnd={active ? () => go(1) : undefined}
                    />
                  </span>
                </button>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
