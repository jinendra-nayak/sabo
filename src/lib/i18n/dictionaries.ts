import type { Locale } from "./config";
import { en, type Dictionary } from "@/content/dictionaries/en";
import { gu } from "@/content/dictionaries/gu";

const dictionaries: Record<Locale, Dictionary> = { en, gu };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
