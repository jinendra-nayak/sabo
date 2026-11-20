"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export function GalleryGrid({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState<number | null>(null);
  const n = images.length;
  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((src, i) => (
          <li key={src}>
            <button
              type="button"
              onClick={() => setActive(i)}
              aria-label={`${title} ${i + 1}`}
              className="group relative block aspect-[4/3] w-full overflow-hidden rounded-xl bg-neutral-200 shadow-sm"
            >
              <Image src={src} alt="" fill sizes="(min-width:1024px) 33vw, 50vw" className="object-cover transition duration-500 group-hover:scale-110" />
              <span className="absolute inset-0 bg-brand/0 transition group-hover:bg-brand/25" />
            </button>
          </li>
        ))}
      </ul>
      <Dialog open={active !== null} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent showCloseButton={false} className="max-w-4xl border-0 bg-black/90 p-2 text-white sm:max-w-4xl">
          <DialogTitle className="sr-only">{title}</DialogTitle>
          {active !== null && (
            <div className="relative aspect-[4/3] w-full">
              <Image src={images[active]} alt={`${title} ${active + 1}`} fill sizes="90vw" className="object-contain" />
              <button type="button" aria-label="Close" onClick={() => setActive(null)} className="absolute right-2 top-2 rounded-full bg-black/60 p-2 hover:bg-[#1d1d1d] hover:text-gold"><X className="size-5" /></button>
              <button type="button" aria-label="Previous" onClick={() => setActive((active + n - 1) % n)} className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 hover:bg-[#1d1d1d] hover:text-gold"><ChevronLeft className="size-5" /></button>
              <button type="button" aria-label="Next" onClick={() => setActive((active + 1) % n)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 hover:bg-[#1d1d1d] hover:text-gold"><ChevronRight className="size-5" /></button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
