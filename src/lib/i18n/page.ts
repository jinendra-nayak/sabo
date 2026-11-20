import { lang as langParam } from "next/root-params";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "./config";
import { getDictionary } from "./dictionaries";

/**
 * Locale + dictionary for the current route.
 *
 * `lang` is a *root param* (the root layout lives in app/[lang]), so it can be read here without
 * awaiting a page's `params` — that keeps navigations instant with Cache Components.
 */
export async function getPageContext() {
  const lang = await langParam();
  if (!isLocale(lang)) notFound();
  return { lang: lang as Locale, t: getDictionary(lang as Locale) };
}
