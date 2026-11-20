"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Dialog as D } from "@base-ui/react/dialog";
import { X } from "lucide-react";

// Shown one by one, in this order — closing one with X reveals the next (same as the bank's mobile site).
const posters = [
  { src: "/official/popup/front.png", w: 864, h: 1363 },
  { src: "/official/popup/second.png", w: 951, h: 1497 },
];
const SESSION = "skdccb-awareness";

interface Labels { title: string; close: string }

export function AwarenessPopup({ labels }: { labels: Labels }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const last = posters.length - 1;

  useEffect(() => {
    try { if (sessionStorage.getItem(SESSION)) return; } catch {}
    const id = setTimeout(() => setOpen(true), 700);
    return () => clearTimeout(id);
  }, []);

  const finish = () => {
    setOpen(false);
    try { sessionStorage.setItem(SESSION, "1"); } catch {}
  };

  // X: next poster, or finish after the last one.
  const next = () => (step >= last ? finish() : setStep(step + 1));

  const p = posters[step];
  const nextPoster = posters[step + 1];

  return (
    <D.Root open={open} onOpenChange={(v) => { if (!v) finish(); }}>
      <D.Portal>
        <D.Backdrop className="fixed inset-0 z-[60] bg-black/65 backdrop-blur-sm transition-opacity duration-200 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <D.Popup className="fixed left-1/2 top-1/2 z-[61] flex max-h-[92dvh] w-[min(94vw,38rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl bg-white shadow-[0_30px_80px_-20px_rgba(0,0,0,.6)] outline-none transition duration-200 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0">
          <header className="relative flex shrink-0 items-center justify-center border-b px-12 py-3.5">
            <D.Title className="text-lg font-medium text-neutral-800">{labels.title}</D.Title>
            <span className="absolute left-4 text-xs tabular-nums text-neutral-400">{step + 1} / {posters.length}</span>
            <button type="button" onClick={next} aria-label={labels.close} className="absolute right-3 grid size-9 place-items-center rounded-full text-neutral-700 transition hover:bg-black hover:text-white">
              <X className="size-5" />
            </button>
          </header>
          <div className="awareness-scroll min-h-0 flex-1 overflow-y-auto p-3 sm:p-4">
            <Image key={step} src={p.src} alt={`${labels.title} ${step + 1}`} width={p.w} height={p.h} priority sizes="(min-width:640px) 600px, 94vw"
              className="poster-in block h-auto w-full rounded-md" />
          </div>
          {/* warm the cache for the next poster so it appears instantly */}
          {nextPoster && <Image src={nextPoster.src} alt="" width={nextPoster.w} height={nextPoster.h} sizes="600px" className="pointer-events-none absolute size-px opacity-0" aria-hidden />}
        </D.Popup>
      </D.Portal>
    </D.Root>
  );
}
