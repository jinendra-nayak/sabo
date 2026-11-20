"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { BookOpen, ChevronDown, Home, Info, Landmark, Menu, PiggyBank, Phone, HandCoins, Headset, X, type LucideIcon } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface Item { href: string; label: string }
export interface NavData {
  home: Item;
  groups: { key: string; label: string; items: Item[] }[];
  contact: Item;
}

const groupIcon: Record<string, LucideIcon> = { about: Info, deposit: PiggyBank, loans: HandCoins, service: Headset, knowMore: BookOpen };

export function MainNav({ nav, menuLabel }: { nav: NavData; menuLabel: string }) {
  const [group, setGroup] = useState<string | null>(null);
  const pathname = usePathname();
  const [open, setOpen] = useState<string | null>(null);
  const [sheet, setSheet] = useState(false);
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(null);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, []);

  const isActive = (href: string) => pathname === href;
  const link = "block whitespace-nowrap px-2 py-2 text-sm xl:px-3 font-medium tracking-wide transition hover:text-gold";

  return (
    <>
      <nav aria-label="Primary" className="hidden lg:block">
        <ul ref={ref} className="flex items-center">
          <li>
            <Link href={nav.home.href} aria-current={isActive(nav.home.href) ? "page" : undefined} className={link}>
              {nav.home.label}
            </Link>
          </li>
          {nav.groups.map((g) => {
            const active = g.items.some((i) => isActive(i.href));
            return (
              <li key={g.key} className="relative" onMouseEnter={() => setOpen(g.key)} onMouseLeave={() => setOpen(null)}>
                <button
                  type="button"
                  aria-expanded={open === g.key}
                  aria-haspopup="true"
                  onClick={() => setOpen(g.key)}
                  className={`${link} flex items-center gap-1 ${active ? "text-gold" : ""}`}
                >
                  {g.label}
                  <ChevronDown className={`size-3.5 transition ${open === g.key ? "rotate-180" : ""}`} aria-hidden />
                </button>
                {open === g.key && (
                  // pt-3 is an invisible hover bridge: the cursor never leaves the <li> between button and menu.
                  <div className="absolute left-0 top-full z-50 pt-3">
                    <ul className="surface min-w-64 animate-in fade-in slide-in-from-top-1 rounded-2xl py-2 text-foreground">
                      {g.items.map((i) => (
                        <li key={i.href}>
                          <Link
                            href={i.href}
                            onClick={() => setOpen(null)}
                            aria-current={isActive(i.href) ? "page" : undefined}
                            className={`block px-4 py-2 text-sm mx-2 rounded-xl hover:bg-brand hover:text-white ${isActive(i.href) ? "bg-brand/10 font-semibold" : ""}`}
                          >
                            {i.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            );
          })}
          <li>
            <Link href={nav.contact.href} aria-current={isActive(nav.contact.href) ? "page" : undefined} className={link}>
              {nav.contact.label}
            </Link>
          </li>
        </ul>
      </nav>

      <Sheet open={sheet} onOpenChange={setSheet}>
        <SheetTrigger
          render={
            <button
              type="button"
              aria-label={menuLabel}
              className="order-last ml-1 grid size-10 place-items-center rounded-xl border border-white/25 bg-white/10 text-white backdrop-blur transition hover:bg-[#1d1d1d] hover:text-gold active:scale-95 sm:ml-2 lg:hidden"
            />
          }
        >
          <Menu className="size-5" />
        </SheetTrigger>
        <SheetContent
          side="left"
          showCloseButton={false}
          className="glass-drawer w-[88vw] max-w-sm gap-0 overflow-hidden border-0 p-0 text-white"
        >
          <div aria-hidden className="glass-shine pointer-events-none absolute inset-0" />

          <div className="relative flex items-center justify-between gap-3 border-b border-white/20 px-4 py-4">
            <SheetTitle className="sr-only">{menuLabel}</SheetTitle>
            <Image src="/official/brand/logo.png" alt="" width={684} height={292} className="h-[4.4rem] w-auto rounded-lg bg-white shadow-lg ring-1 ring-white/40" />
            <SheetClose aria-label="Close" className="grid size-10 place-items-center rounded-full bg-white/10 text-white transition hover:rotate-90 hover:bg-[#1d1d1d] hover:text-gold">
              <X className="size-5" />
            </SheetClose>
          </div>

          <nav aria-label="Mobile" className="drawer-scroll relative flex-1 overflow-y-auto px-3 py-3">
            <ul className="space-y-1">
              <li className="menu-item" style={{ animationDelay: "0.05s" }}>
                <Link href={nav.home.href} onClick={() => setSheet(false)} aria-current={isActive(nav.home.href) ? "page" : undefined} className="mrow">
                  <span className="micon"><Home className="size-5" /></span>
                  <span className="flex-1">{nav.home.label}</span>
                </Link>
              </li>
              {nav.groups.map((g, idx) => {
                const Icon = groupIcon[g.key] ?? Landmark;
                const expanded = group === g.key;
                const active = g.items.some((i) => isActive(i.href));
                return (
                  <li key={g.key} className="menu-item" style={{ animationDelay: `${0.1 + idx * 0.05}s` }}>
                    <button type="button" aria-expanded={expanded} onClick={() => setGroup(expanded ? null : g.key)} className={`mrow w-full ${expanded || active ? "bg-white/10" : ""}`}>
                      <span className={`micon ${active ? "!text-gold ring-1 ring-gold/60" : ""}`}><Icon className="size-5" /></span>
                      <span className="flex-1 text-left">{g.label}</span>
                      <ChevronDown className={`size-4 text-white/60 transition-transform duration-300 ${expanded ? "rotate-180 text-gold" : ""}`} aria-hidden />
                    </button>
                    <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                      <ul className="min-h-0 overflow-hidden">
                        <li className="ml-[1.35rem] mt-1 space-y-0.5 border-l border-white/15 pb-2 pl-3">
                          {g.items.map((i) => (
                            <Link key={i.href} href={i.href} onClick={() => setSheet(false)} tabIndex={expanded ? 0 : -1} aria-current={isActive(i.href) ? "page" : undefined}
                              className={`block rounded-lg px-3 py-2 text-[15px] transition hover:bg-white/10 hover:text-gold ${isActive(i.href) ? "bg-brand font-semibold text-gold ring-1 ring-gold/40" : "text-white/85"}`}>
                              {i.label}
                            </Link>
                          ))}
                        </li>
                      </ul>
                    </div>
                  </li>
                );
              })}
              <li className="menu-item" style={{ animationDelay: `${0.1 + nav.groups.length * 0.05}s` }}>
                <Link href={nav.contact.href} onClick={() => setSheet(false)} aria-current={isActive(nav.contact.href) ? "page" : undefined} className="mrow">
                  <span className="micon"><Phone className="size-5" /></span>
                  <span className="flex-1">{nav.contact.label}</span>
                </Link>
              </li>
            </ul>
          </nav>

        </SheetContent>
      </Sheet>
    </>
  );
}
