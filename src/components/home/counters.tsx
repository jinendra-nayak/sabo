"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

interface Counter {
  key: string;
  label: string;
  value: number;
  unit: string;
  icon: string;
}

const nf = new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function CountUp({ value, run }: { value: number; run: boolean }) {
  const reduced = useReducedMotion();
  const [v, setV] = useState(value); // final value is what the server / no-JS / reduced-motion visitors see
  useEffect(() => {
    if (!run) return;
    if (reduced) return;
    const start = performance.now();
    const dur = 1800;
    let raf = 0;
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      setV(value * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [run, value, reduced]);
  return <span className="tabular-nums">{nf.format(v)}</span>;
}

export function Counters({ title, year, items }: { title: string; year: string; items: Counter[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setRun(true), io.disconnect()), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="my-8">
      <div
        ref={ref}
        className="relative overflow-hidden bg-neutral-950 px-4 py-16 text-white shadow-2xl sm:px-8"
        style={{ backgroundImage: "linear-gradient(rgba(10,18,12,.9), rgba(10,18,12,.96)), url(/official/icons/bg-shape.png)", backgroundSize: "cover" }}
      >
        <div aria-hidden className="absolute -left-16 -top-16 size-56 rounded-full border-[28px] border-white/[0.04]" />
        <div aria-hidden className="absolute -bottom-20 -right-12 size-64 rounded-full border-[36px] border-gold/10" />
        <h2 className="relative mx-auto max-w-7xl text-center text-3xl font-bold md:text-4xl">
          {title} : {year}
        </h2>
        <ul className="relative mx-auto mt-10 grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((c, idx) => (
            <li key={c.key} className="rounded-3xl border border-white/15 bg-white/[0.07] p-6 text-center transition hover:-translate-y-1 hover:border-gold/60 hover:bg-white/[0.12]" style={{ transitionDelay: `${idx * 60}ms` }}>
              <div className="mx-auto grid size-24 place-items-center rounded-full border border-dashed border-white/40">
                <Image src={`/official/icons/${c.icon}.png`} alt="" width={56} height={56} className="size-14 object-contain" />
              </div>
              <p className="mt-5 text-2xl font-bold sm:text-[1.7rem]">
                <CountUp value={c.value} run={run} /> <span className="text-xl font-semibold text-gold">{c.unit}</span>
              </p>
              <p className="mt-1 text-lg text-white/85">{c.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
