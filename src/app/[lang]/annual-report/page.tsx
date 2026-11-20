import type { Metadata } from "next";
import { Download, FileBarChart } from "lucide-react";
import { PageHero, Section } from "@/components/layout/page-hero";
import { documents } from "@/lib/content";
import { getPageContext } from "@/lib/i18n/page";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getPageContext();
  return { title: t.annual.title };
}

export default async function AnnualReportPage() {
  const { lang, t } = await getPageContext();
  return (
    <>
      <PageHero lang={lang} title={t.annual.title} homeLabel={t.common.home} trail={[t.group.about]} />
      <Section narrow>
        <ul className="grid gap-4 sm:grid-cols-2">
          {documents.annualReports.map((d) => (
            <li key={d.url}>
              <a href={d.url} target="_blank" rel="noopener noreferrer" className="surface surface-hover group flex items-center justify-between gap-4 rounded-3xl p-5">
                <span className="flex items-center gap-4">
                  <span className="grid size-12 place-items-center rounded-lg bg-brand text-gold"><FileBarChart className="size-6" aria-hidden /></span>
                  <span>
                    <span className="block text-xs uppercase tracking-wide text-muted-foreground">{t.annual.subtitle}</span>
                    <span className="block text-lg font-semibold">{d.year}</span>
                  </span>
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-brand group-hover:underline"><Download className="size-4" aria-hidden /> {t.common.download}</span>
              </a>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
