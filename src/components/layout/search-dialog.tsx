"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FileText, Landmark, Search } from "lucide-react";
import type { Dictionary } from "@/content/dictionaries/en";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export interface SearchEntry {
  kind: "page" | "doc" | "branch";
  title: string;
  alt: string;
  href: string;
}

export function SearchDialog({ entries, t }: { entries: SearchEntry[]; t: Dictionary }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (s.length < 2) return [];
    return entries.filter((e) => `${e.title} ${e.alt}`.toLowerCase().includes(s)).slice(0, 30);
  }, [q, entries]);

  const groups: { kind: SearchEntry["kind"]; label: string }[] = [
    { kind: "page", label: t.search.pages },
    { kind: "doc", label: t.search.documents },
    { kind: "branch", label: t.search.branchesLabel },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <button
            type="button"
            aria-label={t.nav.search}
            className="rounded-full border border-white/30 p-1.5 text-white sm:p-2 transition hover:bg-white/15"
          />
        }
      >
        <Search className="size-4" />
      </DialogTrigger>
      <DialogContent className="top-24 -translate-y-0 sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{t.search.title}</DialogTitle>
        </DialogHeader>
        <input
          autoFocus
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t.search.placeholder}
          aria-label={t.search.title}
          className="h-11 w-full rounded-md border bg-background px-3 outline-none focus-visible:ring-2 focus-visible:ring-brand"
        />
        <div className="max-h-[50vh] overflow-y-auto" aria-live="polite">
          {q.trim().length < 2 ? (
            <p className="text-sm text-muted-foreground">{t.search.hint}</p>
          ) : results.length === 0 ? (
            <p className="text-sm">{t.common.noResults}</p>
          ) : (
            groups.map((g) => {
              const items = results.filter((r) => r.kind === g.kind);
              if (!items.length) return null;
              return (
                <section key={g.kind} className="mb-3">
                  <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{g.label}</h3>
                  <ul>
                    {items.map((r) => {
                      const external = r.href.startsWith("http");
                      const Icon = r.kind === "doc" ? FileText : r.kind === "branch" ? Landmark : Search;
                      const cls = "flex items-center gap-2 rounded px-2 py-2 text-sm hover:bg-muted";
                      return (
                        <li key={r.href + r.title}>
                          {external ? (
                            <a href={r.href} target="_blank" rel="noopener noreferrer" className={cls}>
                              <Icon className="size-4 text-brand" aria-hidden /> {r.title}
                            </a>
                          ) : (
                            <Link href={r.href} onClick={() => setOpen(false)} className={cls}>
                              <Icon className="size-4 text-brand" aria-hidden /> {r.title}
                            </Link>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </section>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
