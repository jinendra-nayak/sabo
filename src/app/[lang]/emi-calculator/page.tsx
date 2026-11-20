import type { Metadata } from "next";
import { EmiCalculator } from "@/components/features/emi-calculator";
import { PageHero, Section } from "@/components/layout/page-hero";
import { getPageContext } from "@/lib/i18n/page";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getPageContext();
  return { title: t.emi.title };
}

export default async function EmiPage() {
  const { lang, t } = await getPageContext();
  return (
    <>
      <PageHero lang={lang} title={t.emi.title} homeLabel={t.common.home} trail={[t.group.loans]} />
      <Section narrow>
        <EmiCalculator t={t} />
      </Section>
    </>
  );
}
