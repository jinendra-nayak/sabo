import en2gu from "@/content/translations/en2gu.json";
import gu2en from "@/content/translations/gu2en.json";
import type { Locale } from "./config";

const GU = /[઀-૿]/g;
const LAT = /[A-Za-z]/g;
const MARK = /^\s*([♦►⇒✔📌•▪●■]|\*(?=\s))\s*/u;
const TAIL = /\s*[:\-–]?\s*(\(?\s*(Download|Downloa|Click Here)[^)]*\)?)\s*\.?\s*$/i;

const maps: Record<Locale, Record<string, string>> = {
  gu: en2gu as Record<string, string>, // English source -> Gujarati
  en: gu2en as Record<string, string>, // Gujarati source -> English
};

function langOf(line: string): Locale | null {
  const g = line.match(GU)?.length ?? 0;
  const l = line.match(LAT)?.length ?? 0;
  if (g + l === 0) return null;
  return g >= l ? "gu" : "en";
}

/** Translate bank content into `lang`, line by line. Falls back to the original when no translation exists. */
export function tx(text: string, lang: Locale, stripTail = false): string {
  if (!text) return text;
  const src = stripTail ? text.replace(TAIL, "") : text;
  return src
    .split("\n")
    .map((raw) => {
      const ln = raw.replace(MARK, "").trim();
      if (!ln) return raw;
      const hit = maps[lang][ln];
      if (!hit && !langOf(ln)) return raw;
      if (!hit) return lang === "en" ? raw.replace(/[૦-૯]/g, (d) => String(d.charCodeAt(0) - 0xae6)) : raw;
      const marker = raw.match(MARK)?.[0] ?? "";
      return marker + hit;
    })
    .join("\n");
}
