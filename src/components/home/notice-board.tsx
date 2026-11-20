"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Bell } from "lucide-react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

export interface Notice { key: string; tag: string; title: string; note: string; href: string }
interface Labels { title: string; sub: string; isNew: string }

const SPEED = 36; // px / second, bottom → top

/**
 * "What's New" board — notices scroll bottom → top like the bank's site, but smoother and interactive:
 * hover/focus pauses, drag (mouse or finger) scrubs, every line is a link, edges fade out.
 */
export function NoticeBoard({ items, labels }: { items: Notice[]; labels: Labels }) {
  const reduced = useReducedMotion();
  const [hover, setHover] = useState(false);
  const track = useRef<HTMLUListElement>(null);
  const s = useRef({ y: 0, v: SPEED, drag: false, startY: 0, startOffset: 0, moved: 0, paused: false });

  useEffect(() => { s.current.paused = hover; }, [hover]);

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const el = track.current;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const st = s.current;
      if (el) {
        const half = el.scrollHeight / 2;
        if (!st.drag) {
          // velocity eases between 0 (paused) and SPEED, so pausing/resuming never jerks
          const goal = st.paused ? 0 : SPEED;
          st.v += (goal - st.v) * Math.min(1, dt * 6);
          st.y += st.v * dt;
        }
        if (half > 0) {
          if (st.y >= half) st.y -= half;
          if (st.y < 0) st.y += half;
        }
        el.style.transform = `translate3d(0, ${(-st.y).toFixed(2)}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (reduced) return;
    const st = s.current;
    st.drag = true; st.startY = e.clientY; st.startOffset = st.y; st.moved = 0;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const st = s.current;
    if (!st.drag) return;
    const dy = st.startY - e.clientY;
    st.moved = Math.max(st.moved, Math.abs(dy));
    st.y = st.startOffset + dy;
  };
  const endDrag = () => { s.current.drag = false; };

  const row = (it: Notice, idx: number, dup = false) => (
    <li key={it.key + (dup ? "-d" : "")} aria-hidden={dup || undefined} className="border-b border-white/10">
      <Link
        href={it.href}
        tabIndex={dup ? -1 : undefined}
        draggable={false}
        onClick={(e) => { if (s.current.moved > 6) e.preventDefault(); }}
        className="group/n flex flex-col items-start gap-2 rounded-xl px-3 py-3.5 transition duration-300 hover:bg-white/[0.08] focus-visible:bg-white/[0.08] sm:flex-row sm:gap-4 sm:hover:pl-4"
      >
        {idx < 3 ? (
          <span className="mt-0.5 w-fit min-w-[5.75rem] sm:w-[6.75rem] shrink-0 rounded-full border border-gold/70 bg-brand-dark px-2.5 py-0.5 text-center text-[10px] font-black uppercase tracking-widest text-gold">{labels.isNew}</span>
        ) : (
          <span className="mt-0.5 w-fit min-w-[5.75rem] sm:w-[6.75rem] shrink-0 rounded-full border border-white/25 px-2.5 py-0.5 text-center text-[10px] font-bold uppercase tracking-widest text-white/70">{it.tag}</span>
        )}
        <span className="min-w-0 flex-1">
          <span className="block font-semibold leading-snug text-white transition group-hover/n:text-gold sm:text-[17px]">{it.title}</span>
          <span className="mt-0.5 block text-sm text-white/65">{it.note}</span>
        </span>
        <ArrowUpRight className="mt-1 hidden size-4 shrink-0 -translate-x-1 text-gold opacity-0 sm:block transition duration-300 group-hover/n:translate-x-0 group-hover/n:opacity-100" aria-hidden />
      </Link>
    </li>
  );

  return (
    <section aria-label={labels.title} className="mx-auto max-w-7xl px-2 py-10 sm:px-4 sm:py-14">
      <div
        className="relative grid overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#2d5a3a] via-brand to-[#172c1d] text-white shadow-[0_30px_60px_-30px_rgba(23,44,29,.7)] ring-1 ring-white/10 lg:grid-cols-[20rem_1fr]"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => { setHover(false); endDrag(); }}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        onTouchStart={() => setHover(true)}
        onTouchEnd={() => setHover(false)}
      >
        <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full border-[32px] border-white/[0.05]" />

        {/* Title — vertically centred against the feed */}
        <div className="relative flex items-center justify-center p-6 text-center sm:p-8 lg:min-h-full">
          <div className="flex flex-col items-center gap-3">
            <span className="relative grid size-14 place-items-center rounded-2xl bg-brand-dark text-gold ring-1 ring-gold/50">
              <span aria-hidden className="absolute -inset-1.5 rounded-3xl bg-gold/15" />
              <Bell className="relative size-7" aria-hidden />
            </span>
            <h2 className="text-2xl font-bold text-gold sm:text-3xl">{labels.title}</h2>
            <p className="text-sm text-white/75">{labels.sub}</p>
          </div>
        </div>

        {/* Scrolling feed — same height as the card */}
        <div
          className={`board-viewport relative h-[17rem] touch-pan-x select-none border-t border-white/10 sm:h-[19rem] lg:h-[20rem] lg:border-l lg:border-t-0 ${reduced ? "overflow-y-auto" : "cursor-grab overflow-hidden active:cursor-grabbing"}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          onPointerCancel={endDrag}
        >
          <ul ref={track} className="px-3 py-2 will-change-transform sm:px-5 max-lg:pr-14 max-sm:pr-12">
            {items.map((it, idx) => row(it, idx))}
            {!reduced && items.map((it, idx) => row(it, idx, true))}
          </ul>
        </div>
      </div>
    </section>
  );
}
