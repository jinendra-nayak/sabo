"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Calendar, KeyRound, MapPin, Phone, Search } from "lucide-react";
import type { Dictionary } from "@/content/dictionaries/en";
import type { Branch } from "@/lib/content";

export function BranchDirectory({ branches, t }: { branches: Branch[]; t: Dictionary }) {
  const [query, setQuery] = useState(useSearchParams().get("q") ?? "");
  const [lockerOnly, setLockerOnly] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return branches.filter((b) => {
      if (lockerOnly && !b.locker) return false;
      if (!q) return true;
      return `${b.name} ${b.address} ${b.pincode} ${b.ifsc} ${b.code} ${b.contactName}`.toLowerCase().includes(q);
    });
  }, [branches, query, lockerOnly]);

  return (
    <div>
      <div className="surface sticky top-20 z-20 flex flex-col gap-3 rounded-2xl p-3 sm:flex-row sm:items-center">
        <label className="relative flex-1 sm:max-w-lg">
          <span className="sr-only">{t.nav.search}</span>
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.branches.searchPlaceholder}
            className="h-11 w-full rounded-xl border bg-white/80 pl-9 pr-3 outline-none focus-visible:ring-2 focus-visible:ring-gold"
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={lockerOnly} onChange={(e) => setLockerOnly(e.target.checked)} className="size-4 accent-[#25452e]" />
          {t.branches.lockerOnly}
        </label>
        <p className="text-sm font-medium text-brand sm:ml-auto" aria-live="polite">
          {results.length} / {branches.length} {t.branches.count}
        </p>
      </div>

      {results.length === 0 ? (
        <p className="py-10 text-center">{t.common.noResults}</p>
      ) : (
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {results.map((b) => (
            <li key={b.code} className="surface surface-hover group rounded-3xl p-5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-semibold text-brand">{b.name}</h3>
                <span className="rounded bg-gold-soft px-2 py-0.5 text-xs font-semibold">#{b.code}</span>
              </div>
              <p className="mt-2 flex gap-2 text-sm text-neutral-700"><MapPin className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />{b.address}</p>
              <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-neutral-600">
                <div><dt className="font-medium text-neutral-500">{t.branches.ifsc}</dt><dd className="font-mono">{b.ifsc}</dd></div>
                <div><dt className="font-medium text-neutral-500">{t.branches.micr}</dt><dd className="font-mono">{b.micr}</dd></div>
                <div><dt className="font-medium text-neutral-500">{t.branches.pincode}</dt><dd>{b.pincode}</dd></div>
                <div><dt className="font-medium text-neutral-500">{t.branches.opened}</dt><dd className="inline-flex items-center gap-1"><Calendar className="size-3" aria-hidden />{b.opened}</dd></div>
              </dl>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t pt-3">
                <div className="text-sm">
                  <p className="text-neutral-500">{t.branches.contact}</p>
                  <p className="font-medium">{b.contactName}</p>
                </div>
                <div className="flex items-center gap-2">
                  {b.locker && (
                    <span title={t.branches.locker} className="inline-flex items-center gap-1 rounded-full bg-brand/10 px-2 py-1 text-xs font-medium text-brand">
                      <KeyRound className="size-3" aria-hidden /> {t.branches.locker}
                    </span>
                  )}
                  <a href={`tel:+91${b.phone.replace(/^0+/, "")}`} className="inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1.5 text-sm text-gold transition hover:bg-[#1d1d1d] hover:text-gold">
                    <Phone className="size-4" aria-hidden /> {t.branches.call}
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
