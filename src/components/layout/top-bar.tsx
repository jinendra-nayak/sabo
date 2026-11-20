import { Building2, Mail, MailOpen, ShieldCheck, Landmark } from "lucide-react";
import type { Dictionary } from "@/content/dictionaries/en";
import { site } from "@/lib/content";
import { LiveClock } from "./live-clock";

export function TopBar({ t }: { t: Dictionary }) {
  const x = site.external;
  const btn =
    "inline-flex shrink-0 items-center gap-1.5 rounded-full border border-gold/40 bg-gold/15 px-3 py-1 text-xs font-semibold text-gold transition hover:bg-[#1d1d1d] hover:text-gold";
  const ext = { target: "_blank", rel: "noopener noreferrer" } as const;
  return (
    <div className="hidden bg-[#1d1d1d] text-white lg:block">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-2 text-xs sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:text-sm">
        <div className="flex items-center justify-between gap-4 sm:justify-start sm:gap-6">
          <LiveClock />
                    <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 hover:text-gold">
            <Mail className="size-3.5" aria-hidden /> {site.email}
          </a>
        </div>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-0.5 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:justify-end sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
          <a href={x.nivaran} {...ext} className={btn}><ShieldCheck className="size-3.5" aria-hidden /> {t.top.nivaran}</a>
          <a href={x.positivePay} {...ext} className={btn}><Landmark className="size-3.5" aria-hidden /> {t.top.positivePay}</a>
          <a href={x.netBanking} {...ext} className={btn}><Building2 className="size-3.5" aria-hidden /> {t.top.netBanking}</a>
          <a href={x.webMail} {...ext} className={btn}><MailOpen className="size-3.5" aria-hidden /> {t.top.webMail}</a>
        </div>
      </div>
    </div>
  );
}
