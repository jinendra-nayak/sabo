"use client";

import { useState } from "react";
import { Download, FileText, ShieldOff, Zap } from "lucide-react";
import { site } from "@/lib/content";
import { PhoneMock } from "./phone-mock";

const featureIcons = [Zap, FileText, ShieldOff, Download];


/** Original Google Play mark (four-colour triangle). Pure SVG, so there are no image pixels / outlines. */
function PlayLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 512 512" aria-hidden className={className}>
      <path fill="#00c3ff" d="M48 59.49v393a4.33 4.33 0 0 0 7.37 3.07L260 256 55.37 56.42A4.33 4.33 0 0 0 48 59.49z" />
      <path fill="#00f076" d="M345.8 174 89.22 32.64l-.16-.09c-4.42-2.4-8.62.58-9.14 1.76L289.46 242.2z" />
      <path fill="#ff3a44" d="M80.22 479.48c.54 1.18 4.74 4.16 9.14 1.77l.16-.09L345.8 338l-56.34-68.2z" />
      <path fill="#ffce00" d="M457.12 225.76 384.31 184 322.3 256l62 72 72.82-41.76c19.94-11.4 19.94-48.12 0-60.48z" />
    </svg>
  );
}

/** Original Apple mark. */
function AppleLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  );
}

function StoreBadge({ href, label, caption, name, children }: { href: string; label: string; caption: string; name: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="store-badge group/b relative flex h-[clamp(2.6rem,12vw,3.4rem)] min-w-0 flex-1 items-center gap-2 overflow-hidden rounded-full bg-[#0f2417] px-3 text-white max-[359px]:gap-1.5 max-[359px]:px-2.5 shadow-lg shadow-black/30 transition duration-300 hover:-translate-y-1 hover:bg-[#0b1b11] hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:max-w-[11.5rem] sm:gap-2.5 sm:px-4"
    >
      <span className="grid size-[1.35rem] shrink-0 place-items-center max-[359px]:size-4 sm:size-7">{children}</span>
      <span className="min-w-0 leading-none">
        <span className="block whitespace-nowrap text-[8.5px] font-medium uppercase tracking-wide text-white/75 max-[359px]:hidden sm:text-[10px]">{caption}</span>
        <span className="mt-0.5 block truncate text-[13px] font-semibold max-[359px]:text-[10px] max-[359px]:tracking-tight sm:text-[17px]">{name}</span>
      </span>
    </a>
  );
}

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
    <section className="mx-auto my-8 max-w-7xl px-2 sm:px-4 lg:my-12">
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#2d5a3a] via-brand to-[#172c1d] px-5 py-10 text-white shadow-[0_30px_60px_-30px_rgba(23,44,29,.7)] ring-1 ring-white/10 sm:px-8 md:px-12 md:py-14">
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full border-[36px] border-white/[0.05]" />
        <div aria-hidden className="pointer-events-none absolute -bottom-28 -left-20 size-72 rounded-full border-[30px] border-gold/[0.08]" />
        <div aria-hidden className="board-grid pointer-events-none absolute inset-0 opacity-[0.06]" />

        <div className="relative grid items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12">
          {/* ── Animated phone ── */}
          <div
            className="relative mx-auto flex h-[440px] w-full max-w-[340px] items-center justify-center sm:h-[470px]"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <span aria-hidden className="absolute size-72 rounded-full bg-gold/10 blur-2xl" />
            <span aria-hidden className="absolute size-64 rounded-full border border-gold/40" />
            <span aria-hidden className="animate-spin-slow absolute size-80 rounded-full border border-dashed border-white/25" />
            <div className="animate-float relative drop-shadow-[0_30px_40px_rgba(0,0,0,.45)]"><PhoneMock paused={paused} /></div>
          </div>

          {/* ── Copy ── */}
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-gold/60 bg-brand-dark/60 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.14em] text-gold">{sub}</p>
            <h2 className="mt-3 text-3xl font-bold leading-tight md:text-4xl">
              {titleA} <span className="text-gold">{titleB}</span>
            </h2>
            <p className="mt-4 max-w-2xl leading-relaxed text-white/80">{text}</p>

            <ul className="mt-6 grid max-w-xl grid-cols-2 gap-3">
              {features.map((f, idx) => {
                const Icon = featureIcons[idx % featureIcons.length];
                return (
                  <li key={f} className="group/f flex items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.07] px-3 py-2.5 text-sm font-medium backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-gold/60 hover:bg-white/[0.12]">
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-dark text-gold ring-1 ring-gold/40 transition duration-300 group-hover/f:scale-110"><Icon className="size-4" aria-hidden /></span>
                    <span className="min-w-0 leading-snug">{f}</span>
                  </li>
                );
              })}
            </ul>

            {/* Store badges — always side by side, solid dark green pills (code-built, no image outlines) */}
            <div className="mt-8 flex max-w-md flex-nowrap items-center gap-3 max-sm:pr-10 sm:gap-4">
              <StoreBadge href={site.external.playStore} label="Get it on Google Play" caption="Get it on" name="Google Play">
                <PlayLogo className="size-full" />
              </StoreBadge>
              <StoreBadge href={site.external.appStore} label="Download on the App Store" caption="Download on the" name="App Store">
                <AppleLogo className="size-full" />
              </StoreBadge>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
