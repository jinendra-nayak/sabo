"use client";

import { useMemo, useState } from "react";
import { Download, FileText, Search } from "lucide-react";

export interface DocItem { title: string; url: string }

export function DocumentList({
  items,
  placeholder,
  downloadLabel,
  noResults,
}: {
  items: DocItem[];
  placeholder: string;
  downloadLabel: string;
  noResults: string;
}) {
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? items.filter((d) => d.title.toLowerCase().includes(s)) : items;
  }, [items, q]);

  return (
    <div>
      <label className="relative block sm:max-w-md">
        <span className="sr-only">{placeholder}</span>
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder}
          className="h-11 w-full rounded-xl border bg-white/80 pl-9 pr-3 outline-none focus-visible:ring-2 focus-visible:ring-gold"
        />
      </label>
      {list.length === 0 ? (
        <p className="py-8">{noResults}</p>
      ) : (
        <ul className="mt-6 grid gap-3 md:grid-cols-2">
          {list.map((d) => (
            <li key={d.url} className="flex flex-wrap items-center justify-between gap-3 surface surface-hover rounded-2xl p-3">
              <span className="flex min-w-0 flex-1 basis-48 items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-brand/10 text-brand"><FileText className="size-5" aria-hidden /></span>
                <span className="min-w-0 break-words font-medium leading-snug">{d.title}</span>
              </span>
              <a
                href={d.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-brand px-3.5 py-1.5 text-sm text-gold transition hover:bg-[#1d1d1d] hover:text-gold"
              >
                <Download className="size-4" aria-hidden /> {downloadLabel}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

