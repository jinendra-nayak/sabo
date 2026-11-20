import { Building2, Mail, MailOpen, ShieldCheck, Landmark } from "lucide-react";
import type { Dictionary } from "@/content/dictionaries/en";
import { site } from "@/lib/content";
import { LiveClock } from "./live-clock";

export function TopBar({ t }: { t: Dictionary }) {
  const x = site.external;
  const btn =
    "group/c inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border border-gold/50 bg-brand px-3 text-xs lg:px-3 xl:text-sm font-semibold text-gold transition duration-300 hover:-translate-y-0.5 hover:border-gold hover:bg-[#172c1d] hover:shadow-lg hover:shadow-black/40 active:translate-y-0 xl:h-9 xl:gap-2 xl:px-4";
  const ext = { target: "_blank", rel: "noopener noreferrer" } as const;
  return (
    <div className="hidden bg-[#1d1d1d] text-white lg:block">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-2.5 text-xs sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:text-sm">
        <div className="flex items-center justify-between gap-4 sm:justify-start sm:gap-6">
          <span className="whitespace-nowrap"><LiveClock /></span>
                    <a href={`mailto:${site.email}`} className="hidden items-center gap-2 hover:text-gold xl:inline-flex">
            <Mail className="size-3.5" aria-hidden /> {site.email}
          </a>
        </div>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-0.5 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:justify-end sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
          <a href={x.nivaran} {...ext} className={btn}><ShieldCheck className="size-3.5 transition duration-300 group-hover/c:scale-110 xl:size-4" aria-hidden /> {t.top.nivaran}</a>
          <a href={x.positivePay} {...ext} className={btn}><Landmark className="size-3.5 transition duration-300 group-hover/c:scale-110 xl:size-4" aria-hidden /> {t.top.positivePay}</a>
          <a href={x.netBanking} {...ext} className={btn}><Building2 className="size-3.5 transition duration-300 group-hover/c:scale-110 xl:size-4" aria-hidden /> {t.top.netBanking}</a>
          <a href={x.webMail} {...ext} className={btn}><MailOpen className="size-3.5 transition duration-300 group-hover/c:scale-110 xl:size-4" aria-hidden /> {t.top.webMail}</a>
        </div>
      </div>
    </div>
  );
}
