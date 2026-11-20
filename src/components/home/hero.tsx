"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/content/dictionaries/en";
import { site } from "@/lib/content";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { PhoneMock } from "./phone-mock";

type SlideKey = "education" | "app" | "security" | "rates";
const order: SlideKey[] = ["education", "app", "security", "rates"];

/* ── decorative animated shapes (same visual language as the bank's current hero) ── */
function Shapes() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg className="animate-spin-slow absolute -right-24 top-1/2 size-[520px] -translate-y-1/2 text-[#1a3222] lg:right-[6%]" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="9" strokeDasharray="1.2 0" />
      </svg>
      <svg className="animate-twinkle absolute left-[46%] top-[8%] size-9 text-white/25" viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 2.9 6.9 7.1.6-5.4 4.7 1.7 7.3L12 17.8 5.7 21.5l1.7-7.3L2 9.5l7.1-.6z" /></svg>
      <svg className="animate-twinkle absolute bottom-[12%] left-[38%] size-6 text-white/25 [animation-delay:1.2s]" viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 2.9 6.9 7.1.6-5.4 4.7 1.7 7.3L12 17.8 5.7 21.5l1.7-7.3L2 9.5l7.1-.6z" /></svg>
      <span className="animate-float absolute bottom-[14%] left-[34%] size-12 rounded-full border-[7px] border-white/10" />
    </div>
  );
}

/* Security slide: the shield-and-hand artwork is the slide background; the left side fades into the hero green so the text stays readable. */
function SecurityBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden bg-[#06142b]">
      <div className="sec-zoom absolute inset-x-0 bottom-0 top-[42%] lg:inset-0">
        <Image src="/official/hero/security-bg.png" alt="" fill priority sizes="100vw" className="object-cover [object-position:64%_30%] lg:[object-position:72%_28%]" />
      </div>
      <div className="sec-glow absolute right-[8%] bottom-[8%] size-72 lg:right-[16%] lg:top-[16%] lg:bottom-auto lg:size-[26rem] rounded-full bg-cyan-400/25 blur-3xl" />
      <div className="sec-scan absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-cyan-300/10 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#06142b] from-45% via-[#06142b]/60 to-transparent lg:bg-gradient-to-r lg:from-[#06142b] lg:from-0% lg:via-[#06142b]/60 lg:to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#06142b]/70 to-transparent" />
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

export function Hero({ lang, t }: { lang: Locale; t: Dictionary }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const n = order.length;
  const go = useCallback((d: number) => setI((v) => (v + d + n) % n), [n]);

  useEffect(() => {
    if (paused || reduced) return;
    const id = setInterval(() => go(1), 7000);
    return () => clearInterval(id);
  }, [paused, reduced, go]);

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
        {key === "security" ? <SecurityBackdrop key="sec-bg" /> : <Shapes />}
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
        <div className="absolute inset-x-0 bottom-4 flex justify-center">
          <div className="flex items-center gap-2 rounded-full bg-black/35 px-3 py-1.5">
            {order.map((k, idx) => (
              <button key={k} type="button" aria-label={`${t.home.slide} ${idx + 1}`} aria-current={idx === i} onClick={() => setI(idx)} className={`h-2 rounded-full transition-all ${idx === i ? "w-7 bg-gold" : "w-2 bg-white/60 hover:bg-white"}`} />
            ))}
            <button type="button" onClick={() => setPaused((p) => !p)} aria-label={paused ? "Play" : "Pause"} className="ml-1 text-white">
              {paused ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
