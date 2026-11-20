"use client";

import { useState } from "react";
import type { Dictionary } from "@/content/dictionaries/en";

const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

export function EmiCalculator({ t }: { t: Dictionary }) {
  const [amount, setAmount] = useState(500000);
  const [rate, setRate] = useState(10);
  const [years, setYears] = useState(5);
  const [months, setMonths] = useState(0);

  const n = Math.round(years * 12 + months);
  const r = rate / 12 / 100;
  const emi = n <= 0 || amount <= 0 ? 0 : r === 0 ? amount / n : (amount * r * (1 + r) ** n) / ((1 + r) ** n - 1);
  const total = emi * n;
  const interest = Math.max(0, total - amount);
  const principalPct = total > 0 ? (amount / total) * 100 : 100;
  const R = 52;
  const C = 2 * Math.PI * R;

  const num = (set: (v: number) => void) => (e: React.ChangeEvent<HTMLInputElement>) => set(Math.max(0, Number(e.target.value) || 0));
  const field = "h-11 w-full rounded-md border bg-white px-3 outline-none focus-visible:ring-2 focus-visible:ring-gold";

  return (
    <div className="surface grid gap-8 rounded-[2rem] p-5 sm:p-6 md:grid-cols-2 md:p-8">
      <div className="space-y-5">
        <div>
          <label htmlFor="emi-amount" className="mb-1.5 block text-sm font-medium">{t.emi.amount} (₹)</label>
          <input id="emi-amount" type="number" inputMode="numeric" min={0} step={10000} value={amount} onChange={num(setAmount)} className={field} />
          <input type="range" aria-label={t.emi.amount} min={10000} max={10000000} step={10000} value={amount} onChange={num(setAmount)} className="mt-3 w-full accent-[#25452e]" />
        </div>
        <div>
          <label htmlFor="emi-rate" className="mb-1.5 block text-sm font-medium">{t.emi.rate} (%)</label>
          <input id="emi-rate" type="number" inputMode="decimal" min={0} max={40} step={0.05} value={rate} onChange={num(setRate)} className={field} />
          <input type="range" aria-label={t.emi.rate} min={1} max={25} step={0.05} value={rate} onChange={num(setRate)} className="mt-3 w-full accent-[#25452e]" />
        </div>
        <fieldset>
          <legend className="mb-1.5 text-sm font-medium">{t.emi.tenure}</legend>
          <div className="grid grid-cols-2 gap-3">
            <label className="relative">
              <span className="sr-only">{t.emi.years}</span>
              <input type="number" min={0} max={40} value={years} onChange={num(setYears)} className={field} />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{t.emi.years}</span>
            </label>
            <label className="relative">
              <span className="sr-only">{t.emi.months}</span>
              <input type="number" min={0} max={11} value={months} onChange={num(setMonths)} className={field} />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{t.emi.months}</span>
            </label>
          </div>
        </fieldset>
      </div>

      <div className="space-y-5" aria-live="polite">
        <div className="rounded-2xl bg-gradient-to-br from-brand to-brand-dark p-5 text-white shadow-lg">
          <p className="text-sm text-white/80">{t.emi.emi}</p>
          <p className="text-4xl font-bold text-gold">₹ {inr.format(emi)}</p>
        </div>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between gap-4"><dt>{t.emi.totalInterest}</dt><dd className="font-semibold">₹ {inr.format(interest)}</dd></div>
          <div className="flex justify-between gap-4"><dt>{t.emi.totalPayment}</dt><dd className="font-semibold">₹ {inr.format(total)}</dd></div>
        </dl>
        <div>
          <p className="mb-2 text-sm font-medium">{t.emi.breakup}</p>
          <div className="flex items-center gap-5">
            <svg viewBox="0 0 120 120" className="size-28 -rotate-90" role="img" aria-label={`${principalPct.toFixed(2)}% / ${(100 - principalPct).toFixed(2)}%`}>
              <circle cx="60" cy="60" r={R} fill="none" stroke="#f7c600" strokeWidth="16" />
              <circle cx="60" cy="60" r={R} fill="none" stroke="#25452e" strokeWidth="16" strokeDasharray={`${(principalPct / 100) * C} ${C}`} style={{ transition: "stroke-dasharray .5s" }} />
            </svg>
            <ul className="space-y-1 text-sm">
              <li className="flex items-center gap-2"><span className="size-3 rounded-sm bg-brand" />{principalPct.toFixed(2)}% · {t.emi.principal}</li>
              <li className="flex items-center gap-2"><span className="size-3 rounded-sm bg-gold" />{(100 - principalPct).toFixed(2)}% · {t.emi.interest}</li>
            </ul>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">{t.emi.disclaimer}</p>
      </div>
    </div>
  );
}
