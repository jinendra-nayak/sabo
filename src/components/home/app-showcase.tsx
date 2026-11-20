"use client";

import Image from "next/image";
import { useState } from "react";
import { Download, FileText, ShieldOff, Zap } from "lucide-react";
import { site } from "@/lib/content";
import { PhoneMock } from "./phone-mock";

const featureIcons = [Zap, FileText, ShieldOff, Download];

export function AppShowcase({
  sub,
  titleA,
  titleB,
  text,
  features,
}: {
  sub: string;
  titleA: string;
  titleB: string;
  text: string;
  features: string[];
}) {
  const [paused, setPaused] = useState(false);

  return (
    <section className="surface relative mx-auto my-8 max-w-[calc(80rem-1rem)] overflow-hidden rounded-[2rem] px-5 py-10 sm:px-8 md:px-12 md:py-14 lg:my-12">
      <div aria-hidden className="absolute -right-20 -top-20 size-72 rounded-full border-[32px] border-gold/15" />
      <div className="relative grid items-center gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-10">
        {/* ── Animated phone ── */}
        <div
          className="relative mx-auto flex h-[470px] w-full max-w-[340px] items-center justify-center"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <span aria-hidden className="animate-pulse-ring absolute size-60 rounded-full border-2 border-gold/60" />
          <span aria-hidden className="animate-pulse-ring absolute size-60 rounded-full border-2 border-brand/40 [animation-delay:1.4s]" />
          <span aria-hidden className="absolute size-72 rounded-full border border-dashed border-brand/25 animate-spin-slow" />
          <div className="animate-float relative"><PhoneMock paused={paused} /></div>
        </div>

        {/* ── Copy ── */}
        <div>
          <p className="eyebrow">{sub}</p>
          <h2 className="mt-2 text-3xl font-bold leading-tight text-brand md:text-4xl">
            {titleA} <span className="text-brand underline decoration-gold decoration-[6px] underline-offset-[6px]">{titleB}</span>
          </h2>
          <p className="mt-4 max-w-2xl text-justify leading-relaxed text-neutral-700">{text}</p>

          <ul className="mt-6 grid max-w-xl grid-cols-2 gap-3">
            {features.map((f, idx) => {
              const Icon = featureIcons[idx % featureIcons.length];
              return (
                <li key={f} className="surface flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium">
                  <span className="grid size-8 place-items-center rounded-full bg-brand text-gold"><Icon className="size-4" aria-hidden /></span>
                  {f}
                </li>
              );
            })}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href={site.external.playStore} target="_blank" rel="noopener noreferrer" className="rounded-full bg-neutral-900 px-5 py-2.5 shadow-md transition hover:scale-105 hover:bg-brand-dark">
              <Image src="/official/app/play-store.png" alt="Get it on Google Play" width={130} height={31} className="h-9 w-auto" unoptimized />
            </a>
            <a href={site.external.appStore} target="_blank" rel="noopener noreferrer" className="rounded-full bg-neutral-900 px-5 py-2.5 shadow-md transition hover:scale-105 hover:bg-brand-dark">
              <Image src="/official/app/app-store.png" alt="Download on the App Store" width={122} height={31} className="h-9 w-auto" unoptimized />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
