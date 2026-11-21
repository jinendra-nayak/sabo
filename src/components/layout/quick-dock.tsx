"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, IndianRupee, CreditCard, Landmark, ShieldCheck, Mail } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/content/dictionaries/en";
import { site } from "@/lib/content";

/**
 * Mobile-only quick links on the right edge (never rendered at lg and above).
 * Fixed in place. The tiles show for a few seconds, then glide off to the right one after another and only
 * then does the "<" tab fade in (never both at once). A tap on the tab brings the tiles back for a few
 * seconds. No scroll-linked movement, so nothing flickers while the page scrolls.
 */
const SHOW_MS = 4000;
export function QuickDock({ lang, t }: { lang: Locale; t: Dictionary }) {
  const x = site.external;
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(true);

  const items = [
    { label: t.dock.rates, href: `/${lang}/deposit/interest-rates`, Icon: IndianRupee, external: false },
    { label: t.top.positivePay, href: x.positivePay, Icon: CreditCard, external: true },
    { label: t.top.netBanking, href: x.netBanking, Icon: Landmark, external: true },
    { label: t.top.nivaran, href: x.nivaran, Icon: ShieldCheck, external: true },
    { label: t.top.webMail, href: x.webMail, Icon: Mail, external: true },
  ];

  // tuck away after a few seconds, tap outside or press Escape to do it sooner
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => setOpen(false), SHOW_MS);
    const away = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", esc);
    return () => { clearTimeout(timer); document.removeEventListener("pointerdown", away); document.removeEventListener("keydown", esc); };
  }, [open]);

  return (
    <aside ref={root} aria-label="Quick links" className="quick-dock fixed right-0 top-1/2 z-30 -translate-y-1/2 lg:hidden">
      <ul inert={!open} className="flex flex-col items-end gap-2.5">
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
            <li
              key={href}
              style={{ transitionDelay: `${(open ? idx : items.length - 1 - idx) * 70}ms` }}
              className={`transition duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)] ${open ? "translate-x-0 opacity-100" : "translate-x-[110%] opacity-0"}`}
            >
              <div>
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

      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t.dock.show}
        aria-expanded={open}
        tabIndex={open ? -1 : 0}
        style={{ transitionDelay: open ? "0ms" : "1100ms" }}
        className={`glass-chip absolute right-0 top-1/2 grid h-14 w-7 -translate-y-1/2 place-items-center rounded-l-xl text-gold transition duration-500 ease-out active:brightness-125 ${open ? "pointer-events-none translate-x-full opacity-0" : "opacity-100"}`}
      >
        <ChevronLeft className="size-4" aria-hidden />
      </button>
    </aside>
  );
}
