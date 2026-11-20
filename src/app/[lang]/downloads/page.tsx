import type { Metadata } from "next";
import { DocumentList } from "@/components/features/document-list";
import { PageHero, Section } from "@/components/layout/page-hero";
import { documents } from "@/lib/content";
import { tx } from "@/lib/i18n/translate-text";
import { getPageContext } from "@/lib/i18n/page";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getPageContext();
  return { title: t.downloads.title };
}

export default async function DownloadsPage() {
  const { lang, t } = await getPageContext();
  return (
    <>
      <PageHero lang={lang} title={t.downloads.title} homeLabel={t.common.home} trail={[t.group.knowMore]} />
      <Section>
        <DocumentList items={documents.forms.map((d) => ({ ...d, title: tx(d.title, lang) }))} placeholder={t.downloads.searchPlaceholder} downloadLabel={t.common.download} noResults={t.common.noResults} />
      </Section>
    </>
  );
}
