import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, Section } from "@/components/layout/page-hero";
import { about } from "@/lib/content";
import { tx } from "@/lib/i18n/translate-text";
import { getPageContext } from "@/lib/i18n/page";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getPageContext();
  return { title: t.about.title };
}

export default async function AboutPage() {
  const { lang, t } = await getPageContext();
  return (
    <>
      <PageHero lang={lang} title={t.about.title} homeLabel={t.common.home} />
      <Section narrow>
        <h2 className="mb-4 border-l-4 border-gold pl-3 text-2xl font-bold text-brand">{t.about.history}</h2>
                <div lang={lang} className="space-y-5 text-left sm:text-justify leading-loose text-neutral-800">
          {about.history.map((p, i) => <p key={i}>{tx(p, lang)}</p>)}
        </div>
        <Link href={`/${lang}/chairmans-message`} className="mt-8 inline-block rounded-md bg-brand px-5 py-3 font-semibold text-gold transition hover:bg-[#1d1d1d] hover:text-gold">
          {t.about.chairman}
        </Link>
      </Section>
    </>
  );
}
