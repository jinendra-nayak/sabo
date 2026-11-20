"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

export function BannerCarousel({
  slides,
  labels,
}: {
  slides: string[];
  labels: { slide: string; prev: string; next: string };
}) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const n = slides.length;

  const go = useCallback((d: number) => setI((v) => (v + d + n) % n), [n]);

  useEffect(() => {
    if (paused || reduced) return;
    const id = setInterval(() => go(1), 5500);
    return () => clearInterval(id);
  }, [paused, reduced, go]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Highlights"
      className="relative mx-auto mt-6 max-w-7xl px-2 sm:px-4"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="relative overflow-hidden rounded-2xl bg-brand-dark shadow-2xl ring-1 ring-white/40 sm:rounded-3xl">
      <div className="relative aspect-[16/9] sm:aspect-[1350/600]">
        {slides.map((src, idx) => (
          <div
            key={src}
            role="group"
            aria-roledescription="slide"
            aria-label={`${idx + 1} / ${n}`}
            aria-hidden={idx !== i}
            className={`absolute inset-0 transition-opacity duration-700 ${idx === i ? "opacity-100" : "opacity-0"}`}
          >
            <Image
              src={src}
              alt={`${labels.slide} ${idx + 1}`}
              fill
              priority={idx === 0}
              sizes="100vw"
              className="object-contain sm:object-cover"
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => go(-1)}
        aria-label={labels.prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-white/30 bg-white/15 p-2 text-white transition hover:bg-[#1d1d1d] hover:text-gold sm:left-7"
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        aria-label={labels.next}
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-white/30 bg-white/15 p-2 text-white transition hover:bg-[#1d1d1d] hover:text-gold sm:right-7"
      >
        <ChevronRight className="size-5" />
      </button>

      <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-2 sm:bottom-6">
        <div className="flex items-center gap-1.5 rounded-full border border-white/25 bg-black/35 px-3 py-1.5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`${labels.slide} ${idx + 1}`}
              aria-current={idx === i}
              onClick={() => setI(idx)}
              className={`h-2 rounded-full transition-all ${idx === i ? "w-6 bg-gold" : "w-2 bg-white/70 hover:bg-white"}`}
            />
          ))}
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? "Play" : "Pause"}
            className="ml-2 text-white"
          >
            {paused ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
          </button>
        </div>
      </div>
      </div>
    </section>
  );
}
