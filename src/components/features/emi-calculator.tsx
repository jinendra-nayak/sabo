"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import type { Dictionary } from "@/content/dictionaries/en";

const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

// Hard limits keep the maths finite (no NaN / Infinity) and the result a sensible length.
const MAX_AMOUNT = 1_000_000_000; // ₹100 crore
const MAX_RATE = 40;
const MAX_YEARS = 40;
const MAX_MONTHS = 11;

const AMOUNT_PRESETS = [100_000, 200_000, 500_000, 1_000_000, 2_500_000];
const YEAR_PRESETS = [1, 3, 5, 10, 15, 20];
const DEFAULTS = { amount: "500000", rate: "10", years: "5", months: "0" };

/** Parse what the user typed into a safe number within [0, max]; blank / junk → 0. */
const clamp = (raw: string, max: number) => {
  const v = Number(raw);
  return Number.isFinite(v) ? Math.min(max, Math.max(0, v)) : 0;
};

const pct = (v: number, min: number, max: number) => `${Math.min(100, Math.max(0, ((v - min) / (max - min)) * 100))}%`;

export function EmiCalculator({ t }: { t: Dictionary }) {
  // Raw strings, so a field can be empty or half-typed ("7.") without snapping to 0 while typing.
  const [amountS, setAmountS] = useState(DEFAULTS.amount);
  const [rateS, setRateS] = useState(DEFAULTS.rate);
  const [yearsS, setYearsS] = useState(DEFAULTS.years);
  const [monthsS, setMonthsS] = useState(DEFAULTS.months);

  const amount = clamp(amountS, MAX_AMOUNT);
  const rate = clamp(rateS, MAX_RATE);
  const yrs = Math.floor(clamp(yearsS, MAX_YEARS));
  const mos = Math.floor(clamp(monthsS, MAX_MONTHS));
  const n = yrs * 12 + mos;
  const r = rate / 12 / 100;
  const valid = n > 0 && amount > 0;
  const emi = !valid ? 0 : r === 0 ? amount / n : (amount * r * (1 + r) ** n) / ((1 + r) ** n - 1);
  const total = emi * n;
  const interest = Math.max(0, total - amount);
  const principalPct = valid && total > 0 ? (amount / total) * 100 : 100;
  const R = 52;
  const C = 2 * Math.PI * R;

  /** 5,00,000 → "5 Lakh", 1,00,00,000 → "1 Crore" (kept short for captions and quick-pick chips) */
  const words = (v: number) => {
    const f = (x: number) => String(+x.toFixed(2));
    if (v >= 1e7) return `${f(v / 1e7)} ${t.emi.crore}`;
    if (v >= 1e5) return `${f(v / 1e5)} ${t.home.lakh}`;
    return inr.format(v);
  };

  // while typing: accept digits / one decimal point only (no "e", "-" or "+")
  const typed = (set: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (/^\d*\.?\d*$/.test(v)) set(v);
  };
  // on leaving the field: show the value that is really being used (clamped, tidy)
  const settle = (set: (v: string) => void, raw: string, max: number, whole = false) => () => {
    const v = clamp(raw, max);
    set(String(whole ? Math.floor(v) : v));
  };
  const slide = (set: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => set(e.target.value);
  const reset = () => { setAmountS(DEFAULTS.amount); setRateS(DEFAULTS.rate); setYearsS(DEFAULTS.years); setMonthsS(DEFAULTS.months); };
  const dirty = amountS !== DEFAULTS.amount || rateS !== DEFAULTS.rate || yearsS !== DEFAULTS.years || monthsS !== DEFAULTS.months;

  const label = "mb-1.5 flex items-baseline justify-between gap-2 text-sm font-semibold text-brand";
  const field = "h-12 w-full rounded-xl border border-brand/15 bg-white px-3 text-lg font-semibold tabular-nums outline-none transition focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold aria-[invalid=true]:border-red-400";
  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1 text-xs font-semibold transition active:scale-95 ${active ? "border-brand bg-brand text-gold" : "border-brand/20 bg-white text-brand hover:border-gold hover:bg-gold-soft/60"}`;
  const hint = "mt-1.5 flex justify-between text-[11px] text-neutral-500";

  return (
    <div className="surface grid gap-6 rounded-[2rem] p-4 sm:p-6 md:grid-cols-[1.05fr_1fr] md:gap-8 md:p-8">
      {/* ───────── Inputs ───────── */}
      <div className="space-y-6">
        {/* Phones: the result sits below the inputs, so keep a slim EMI bar pinned while adjusting them */}
        <div aria-hidden className="sticky top-[6.1rem] z-10 -mx-1 flex items-center justify-between gap-3 rounded-2xl bg-brand px-4 py-2.5 text-white shadow-lg md:hidden">
          <span className="text-xs text-white/80">{t.emi.emi}</span>
          <span className="truncate text-xl font-bold tabular-nums text-gold">₹ {inr.format(emi)}</span>
        </div>
        <div>
          <label htmlFor="emi-amount" className={label}>
            <span>{t.emi.amount}</span>
            <span className="text-xs font-medium text-neutral-500">{valid || amount > 0 ? `₹ ${words(amount)}` : ""}</span>
          </label>
          <div className="relative">
            <span aria-hidden className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg font-semibold text-brand/60">₹</span>
            <input id="emi-amount" type="text" inputMode="numeric" autoComplete="off" value={amountS} onChange={typed(setAmountS)} onBlur={settle(setAmountS, amountS, MAX_AMOUNT)} aria-invalid={amount <= 0} className={`${field} pl-8`} />
          </div>
          <input type="range" aria-label={t.emi.amount} min={10000} max={10000000} step={10000} value={Math.min(10000000, Math.max(10000, amount))} onChange={slide(setAmountS)} style={{ "--pct": pct(amount, 10000, 10000000) } as React.CSSProperties} className="emi-range mt-4 w-full" />
          <div className={hint}><span>₹ 10,000</span><span>₹ 1 {t.emi.crore}</span></div>
          <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label={t.emi.quick}>
            {AMOUNT_PRESETS.map((v) => (
              <button key={v} type="button" onClick={() => setAmountS(String(v))} aria-pressed={amount === v} className={chip(amount === v)}>₹ {words(v)}</button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="emi-rate" className={label}>
            <span>{t.emi.rate}</span>
            <span className="text-xs font-medium text-neutral-500">{rate}% p.a.</span>
          </label>
          <div className="relative">
            <input id="emi-rate" type="text" inputMode="decimal" autoComplete="off" value={rateS} onChange={typed(setRateS)} onBlur={settle(setRateS, rateS, MAX_RATE)} className={`${field} pr-10`} />
            <span aria-hidden className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-lg font-semibold text-brand/60">%</span>
          </div>
          <input type="range" aria-label={t.emi.rate} min={1} max={25} step={0.05} value={Math.min(25, Math.max(1, rate))} onChange={slide(setRateS)} style={{ "--pct": pct(rate, 1, 25) } as React.CSSProperties} className="emi-range mt-4 w-full" />
          <div className={hint}><span>1%</span><span>25%</span></div>
        </div>

        <fieldset>
          <legend className={`${label} w-full`}>
            <span>{t.emi.tenure}</span>
            <span className="text-xs font-medium text-neutral-500">{n > 0 ? `${n} ${t.emi.months}` : ""}</span>
          </legend>
          <div className="grid grid-cols-2 gap-3">
            <label className="relative">
              <span className="sr-only">{t.emi.years}</span>
              <input type="text" inputMode="numeric" autoComplete="off" value={yearsS} onChange={typed(setYearsS)} onBlur={settle(setYearsS, yearsS, MAX_YEARS, true)} aria-invalid={n <= 0} className={`${field} pr-12`} />
              <span aria-hidden className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-neutral-500">{t.emi.years}</span>
            </label>
            <label className="relative">
              <span className="sr-only">{t.emi.months}</span>
              <input type="text" inputMode="numeric" autoComplete="off" value={monthsS} onChange={typed(setMonthsS)} onBlur={settle(setMonthsS, monthsS, MAX_MONTHS, true)} aria-invalid={n <= 0} className={`${field} pr-12`} />
              <span aria-hidden className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-neutral-500">{t.emi.months}</span>
            </label>
          </div>
          <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label={t.emi.quick}>
            {YEAR_PRESETS.map((y) => (
              <button key={y} type="button" onClick={() => { setYearsS(String(y)); setMonthsS("0"); }} aria-pressed={yrs === y && mos === 0} className={chip(yrs === y && mos === 0)}>{y} {t.emi.years}</button>
            ))}
          </div>
        </fieldset>

        <button type="button" onClick={reset} disabled={!dirty} className="inline-flex items-center gap-2 rounded-full border border-brand/20 px-4 py-2 text-sm font-semibold text-brand transition hover:border-gold hover:bg-gold-soft/60 disabled:pointer-events-none disabled:opacity-40">
          <RotateCcw className="size-4" aria-hidden /> {t.emi.reset}
        </button>
      </div>

      {/* ───────── Result ───────── */}
      <div className="space-y-4 md:sticky md:top-28 md:self-start" aria-live="polite">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand to-brand-dark p-5 text-white shadow-lg">
          <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 size-36 rounded-full border-[16px] border-white/[0.06]" />
          <p className="text-sm text-white/80">{t.emi.emi}</p>
          <p className="mt-1 break-all text-3xl font-bold tabular-nums text-gold sm:text-4xl">₹ {inr.format(emi)}</p>
          <p className="mt-1 text-xs text-white/60">{valid ? `${n} × ₹ ${inr.format(emi)}` : " "}</p>
        </div>

        {!valid && (
          <p role="alert" className="rounded-xl border border-gold/60 bg-gold-soft/60 px-3 py-2 text-sm">{amount <= 0 ? t.emi.needAmount : t.emi.needTenure}</p>
        )}

        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl border border-brand/10 bg-white/70 p-3.5">
            <dt className="text-xs leading-snug text-neutral-600">{t.emi.totalInterest}</dt>
            <dd className="mt-1 break-all text-lg font-bold tabular-nums text-brand">₹ {inr.format(interest)}</dd>
          </div>
          <div className="rounded-2xl border border-brand/10 bg-white/70 p-3.5">
            <dt className="text-xs leading-snug text-neutral-600">{t.emi.totalPayment}</dt>
            <dd className="mt-1 break-all text-lg font-bold tabular-nums text-brand">₹ {inr.format(total)}</dd>
          </div>
        </dl>

        <div className="rounded-2xl border border-brand/10 bg-white/70 p-4">
          <p className="mb-3 text-sm font-semibold text-brand">{t.emi.breakup}</p>
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              <svg viewBox="0 0 120 120" className="size-32 -rotate-90" role="img" aria-label={`${principalPct.toFixed(2)}% / ${(100 - principalPct).toFixed(2)}%`}>
                <circle cx="60" cy="60" r={R} fill="none" stroke="#f7c600" strokeWidth="16" />
                <circle cx="60" cy="60" r={R} fill="none" stroke="#25452e" strokeWidth="16" strokeDasharray={`${(principalPct / 100) * C} ${C}`} style={{ transition: "stroke-dasharray .5s" }} />
              </svg>
              <div aria-hidden className="absolute inset-0 grid place-items-center text-center leading-tight">
                <div>
                  <p className="text-lg font-bold tabular-nums text-brand">{(100 - principalPct).toFixed(0)}%</p>
                  <p className="text-[10px] uppercase tracking-wide text-neutral-500">{t.emi.interest}</p>
                </div>
              </div>
            </div>
            <ul className="min-w-0 flex-1 space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span className="mt-1 size-3 shrink-0 rounded-sm bg-brand" />
                <span className="min-w-0"><span className="block text-xs text-neutral-600">{principalPct.toFixed(1)}% · {t.emi.principal}</span><span className="block break-all font-semibold tabular-nums">₹ {inr.format(valid ? amount : 0)}</span></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 size-3 shrink-0 rounded-sm bg-gold" />
                <span className="min-w-0"><span className="block text-xs text-neutral-600">{(100 - principalPct).toFixed(1)}% · {t.emi.interest}</span><span className="block break-all font-semibold tabular-nums">₹ {inr.format(interest)}</span></span>
              </li>
            </ul>
          </div>
        </div>

        <p className="text-xs leading-relaxed text-neutral-500">{t.emi.limits} {t.emi.disclaimer}</p>
      </div>
    </div>
  );
}
