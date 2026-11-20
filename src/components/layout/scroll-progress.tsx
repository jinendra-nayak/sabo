"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/** Back-to-top button that appears after scrolling down. (No progress bar.) */
export function ScrollProgress({ label }: { label: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const next = document.documentElement.scrollTop > 600;
      setShow((prev) => (prev === next ? prev : next));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);

  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-5 right-4 z-30 grid size-11 place-items-center rounded-full bg-brand text-gold shadow-xl ring-1 ring-gold/40 transition-all duration-300 hover:bg-[#1d1d1d] sm:right-6 ${show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}
    >
      <ArrowUp className="size-5" />
    </button>
  );
}
