import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/content/dictionaries/en";
import { NoticeBoard, type Notice } from "./notice-board";

const routes = {
  rates: "/deposit/interest-rates",
  fd: "/deposit/new-fixed-deposit-scheme",
  charges: "/service/services-charge",
  awareness: "/know-more/customer-awareness",
  app: "/service/mobile-banking",
  lakshmi: "/deposit/sabar-lakshmi-recurring",
} as const;

/** "What's New" notification board (spotlight + queue). */
export function NewsTicker({ lang, t }: { lang: Locale; t: Dictionary }) {
  const items: Notice[] = (Object.keys(routes) as (keyof typeof routes)[]).map((k) => ({ key: k, ...t.home.notices[k], href: `/${lang}${routes[k]}` }));
  return (
    <NoticeBoard
      items={items}
      labels={{ title: t.home.whatsNew, sub: t.home.boardSub, isNew: t.home.boardNew }}
    />
  );
}
