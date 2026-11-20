"use client";

import Link from "next/link";
import { IndianRupee, CreditCard, Landmark, ShieldCheck, Mail } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/content/dictionaries/en";
import { site } from "@/lib/content";

/**
 * Right-edge quick links for phones/tablets. On small screens the top info strip is hidden (as on the bank's
 * own mobile site) and these links live here instead: staggered slide-in, label slides out on tap/hover.
 */
export function QuickDock({ lang, t }: { lang: Locale; t: Dictionary }) {
  const x = site.external;
  const items = [
    { label: t.dock.rates, href: `/${lang}/deposit/interest-rates`, Icon: IndianRupee, external: false },
    { label: t.top.positivePay, href: x.positivePay, Icon: CreditCard, external: true },
    { label: t.top.netBanking, href: x.netBanking, Icon: Landmark, external: true },
    { label: t.top.nivaran, href: x.nivaran, Icon: ShieldCheck, external: true },
    { label: t.top.webMail, href: x.webMail, Icon: Mail, external: true },
  ];

  return (
    <aside aria-label="Quick links" className="quick-dock fixed right-0 top-1/2 z-30 -translate-y-1/2 lg:hidden">
      <ul className="flex flex-col items-end gap-2.5">
        {items.map(({ label, href, Icon, external }, idx) => {
          const cls = "dock-link group/dock glass-chip relative flex h-12 items-center justify-end overflow-hidden rounded-l-xl text-white transition-all duration-300 hover:!bg-[#172c1d] hover:text-gold focus-visible:!bg-[#172c1d] focus-visible:text-gold active:scale-95 sm:h-14";
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
              {external ? (
                <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label} className={cls}>{inner}</a>
              ) : (
                <Link href={href} aria-label={label} title={label} className={cls}>{inner}</Link>
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
