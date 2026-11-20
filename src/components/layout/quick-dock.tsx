"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, IndianRupee, CreditCard, Landmark, ShieldCheck, Mail } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/content/dictionaries/en";
import { site } from "@/lib/content";

/**
 * Mobile-only quick links on the right edge (never rendered at lg and above).
 * Scroll-linked: scrolling down slides the tiles away one by one, scrolling up brings them back, and a
 * chevron tab fades in as they leave. Tapping the tab slowly reopens them. No hard on/off switch.
 */
const RANGE = 280; // px of scrolling for a full collapse / expand
const STAGGER = 0.09; // each tile starts leaving a little after the previous one
const clamp = (v: number) => Math.min(1, Math.max(0, v));

export function QuickDock({ lang, t }: { lang: Locale; t: Dictionary }) {
  const x = site.external;
  const list = useRef<HTMLUListElement>(null);
  const tab = useRef<HTMLButtonElement>(null);
  const [expanded, setExpanded] = useState(true);
  // collapse progress: 0 = fully open, 1 = fully tucked away
  const m = useRef({ target: 0, cur: 0, lastY: 0, lockUntil: 0, shown: true });

  const items = [
    { label: t.dock.rates, href: `/${lang}/deposit/interest-rates`, Icon: IndianRupee, external: false },
    { label: t.top.positivePay, href: x.positivePay, Icon: CreditCard, external: true },
    { label: t.top.netBanking, href: x.netBanking, Icon: Landmark, external: true },
    { label: t.top.nivaran, href: x.nivaran, Icon: ShieldCheck, external: true },
    { label: t.top.webMail, href: x.webMail, Icon: Mail, external: true },
  ];

  useEffect(() => {
    const st = m.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    st.lastY = window.scrollY;
    let raf = 0;
    let last = performance.now();

    const render = () => {
      const ul = list.current;
      const tb = tab.current;
      if (!ul || !tb) return;
      const n = ul.children.length;
      const span = 1 - STAGGER * (n - 1);
      Array.from(ul.children).forEach((li, i) => {
        const tile = li.firstElementChild as HTMLElement | null;
        if (!tile) return;
        // later tiles leave later and return first → a gentle cascade
        const local = clamp((st.cur - i * STAGGER) / span);
        tile.style.transform = `translate3d(${(local * 112).toFixed(2)}%,0,0)`;
        tile.style.opacity = String(1 - local * 0.9);
      });
      ul.inert = st.cur > 0.6;
      const tt = clamp((st.cur - 0.55) / 0.45);
      tb.style.opacity = String(tt);
      tb.style.transform = `translate3d(${((1 - tt) * 100).toFixed(2)}%,-50%,0)`;
      tb.style.pointerEvents = tt > 0.5 ? "auto" : "none";
      tb.tabIndex = tt > 0.5 ? 0 : -1;
      const nowShown = st.cur < 0.6;
      if (nowShown !== st.shown) { st.shown = nowShown; setExpanded(nowShown); }
    };

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const rate = now < st.lockUntil ? 4 : 9; // a tap opens slower than scroll-linking tracks
      st.cur = reduced ? st.target : st.cur + (st.target - st.cur) * (1 - Math.exp(-dt * rate));
      if (Math.abs(st.target - st.cur) < 0.0005) st.cur = st.target;
      render();
      raf = requestAnimationFrame(loop);
    };

    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - st.lastY;
      st.lastY = y;
      if (performance.now() < st.lockUntil) return; // ignore scroll right after a tap-to-open
      st.target = y <= 24 ? 0 : clamp(st.target + dy / RANGE); // down → collapse, up → expand, proportionally
    };

    render();
    raf = requestAnimationFrame(loop);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { cancelAnimationFrame(raf); window.removeEventListener("scroll", onScroll); };
  }, []);

  const open = () => {
    const st = m.current;
    st.target = 0;
    st.lockUntil = performance.now() + 1100;
  };

  return (
    <aside aria-label="Quick links" className="quick-dock fixed right-0 top-1/2 z-30 -translate-y-1/2 lg:hidden">
      <ul ref={list} className="flex flex-col items-end gap-2.5">
        {items.map(({ label, href, Icon, external }, idx) => {
          const cls = "dock-link group/dock glass-chip relative flex h-12 items-center justify-end overflow-hidden rounded-l-xl text-white transition-colors duration-300 hover:!bg-[#172c1d] hover:text-gold focus-visible:!bg-[#172c1d] focus-visible:text-gold active:brightness-125 sm:h-14";
          const inner = (
            <>
              <span className="max-w-0 overflow-hidden whitespace-nowrap pl-0 text-sm font-semibold opacity-0 transition-all duration-300 group-hover/dock:max-w-44 group-hover/dock:pl-4 group-hover/dock:opacity-100 group-focus-visible/dock:max-w-44 group-focus-visible/dock:pl-4 group-focus-visible/dock:opacity-100">{label}</span>
              <span className="grid size-12 shrink-0 place-items-center sm:size-14">
                <Icon className="size-5 transition group-hover/dock:scale-110" aria-hidden />
              </span>
            </>
          );
          return (
            <li key={href} className="dock-in" style={{ animationDelay: `${0.9 + idx * 0.09}s` }}>
              {/* scroll-driven transform lives on this wrapper (the li carries the entrance animation) */}
              <div className="will-change-transform">
                {external ? (
                  <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label} className={cls}>{inner}</a>
                ) : (
                  <Link href={href} aria-label={label} title={label} className={cls}>{inner}</Link>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {/* Chevron tab: fades/slides in gradually as the icons leave */}
      <button
        ref={tab}
        type="button"
        onClick={open}
        aria-label={t.dock.show}
        aria-expanded={expanded}
        style={{ opacity: 0, transform: "translate3d(100%,-50%,0)", pointerEvents: "none" }}
        className="glass-chip absolute right-0 top-1/2 grid h-14 w-7 place-items-center rounded-l-xl text-gold will-change-transform active:brightness-125"
      >
        <ChevronLeft className="size-4" aria-hidden />
      </button>
    </aside>
  );
}
