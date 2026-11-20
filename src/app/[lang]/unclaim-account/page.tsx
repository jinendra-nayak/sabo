import type { Metadata } from "next";
import { Download, Search } from "lucide-react";
import { PageHero, Section } from "@/components/layout/page-hero";
import { documents } from "@/lib/content";
import { getPageContext } from "@/lib/i18n/page";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getPageContext();
  return { title: t.unclaim.title };
}

export default async function UnclaimPage() {
  const { lang, t } = await getPageContext();
  const form = documents.forms.find((d) => /unclaim/i.test(d.title));
  const btn = "inline-flex items-center gap-2 rounded-md px-5 py-3 font-semibold transition";
  return (
    <>
      <PageHero lang={lang} title={t.unclaim.title} homeLabel={t.common.home} trail={[t.group.about]} />
      <Section narrow>
        <p className="leading-relaxed text-neutral-700">{t.unclaim.text}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="https://skdccb.bank.in/unclaim-account" target="_blank" rel="noopener noreferrer" className={`${btn} bg-brand text-gold hover:bg-[#1d1d1d] hover:text-gold`}>
            <Search className="size-4" aria-hidden /> {t.unclaim.openPortal}
          </a>
          {form && (
            <a href={form.url} target="_blank" rel="noopener noreferrer" className={`${btn} border border-brand text-brand hover:bg-brand hover:text-white`}>
              <Download className="size-4" aria-hidden /> {t.unclaim.form}
            </a>
          )}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">{t.common.external}</p>
      </Section>
    </>
  );
}
