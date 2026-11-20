"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const screens = ["/official/app/1st.png", "/official/app/2nd.png", "/official/app/3rd.png"];

/**
 * Official app screenshots inside the official phone frame.
 * Drawn at the frame's native 260×396 so the artwork stays sharp (no CSS scaling of the frame).
 */
export function PhoneMock({ showDots = true, paused = false }: { showDots?: boolean; paused?: boolean }) {
  const [i, setI] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (paused || reduced) return;
    const id = setInterval(() => setI((v) => (v + 1) % screens.length), 3000);
    return () => clearInterval(id);
  }, [paused, reduced]);

  return (
    <div className="relative mx-auto h-[396px] w-[260px] select-none">
      {/* screens sit under the transparent frame */}
      <div className="absolute left-[44px] top-[11px] h-[358px] w-[172px] overflow-hidden rounded-[22px] bg-white">
        {screens.map((src, idx) => (
          <div key={src} aria-hidden={idx !== i} className={`absolute inset-0 transition-opacity duration-700 ${idx === i ? "opacity-100" : "opacity-0"}`}>
            <Image src={src} alt={`App screen ${idx + 1}`} fill sizes="172px" unoptimized className="object-cover" />
          </div>
        ))}
      </div>
      <Image src="/official/app/phone-frame.png" alt="" width={260} height={396} unoptimized className="pointer-events-none absolute inset-0" />
      {showDots && (
        <div className="absolute -bottom-7 left-1/2 flex -translate-x-1/2 gap-2" role="tablist" aria-label="App screens">
          {screens.map((_, idx) => (
            <button key={idx} role="tab" aria-selected={idx === i} aria-label={`App screen ${idx + 1}`} onClick={() => setI(idx)} className={`h-2 rounded-full transition-all ${idx === i ? "w-7 bg-brand" : "w-2 bg-brand/30 hover:bg-brand/60"}`} />
          ))}
        </div>
      )}
    </div>
  );
}
