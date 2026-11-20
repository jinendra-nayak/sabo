"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";

/** Thin gold reading-progress line at the top + a back-to-top button that appears after scrolling. */
export function ScrollProgress({ label }: { label: string }) {
  const bar = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const p = max > 0 ? h.scrollTop / max : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
      setShow(h.scrollTop > 600);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);

  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[3px]">
        <div ref={bar} className="scroll-progress h-full w-full bg-gradient-to-r from-gold to-gold" style={{ transform: "scaleX(0)" }} />
      </div>
      <button
        type="button"
        aria-label={label}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-5 right-4 z-30 grid size-11 place-items-center rounded-full bg-brand text-gold shadow-xl ring-1 ring-white/30 transition-all duration-300 hover:bg-[#1d1d1d] hover:text-gold sm:right-6 ${show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}
      >
        <ArrowUp className="size-5" />
      </button>
    </>
  );
}
