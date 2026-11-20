import type { Metadata } from "next";
import { Suspense } from "react";
import { BranchDirectory } from "@/components/features/branch-directory";
import { PageHero, Section } from "@/components/layout/page-hero";
import { branches } from "@/lib/content";
import { getPageContext } from "@/lib/i18n/page";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getPageContext();
  return { title: t.branches.title };
}

export default async function BranchesPage() {
  const { lang, t } = await getPageContext();
  return (
    <>
      <PageHero lang={lang} title={t.branches.title} homeLabel={t.common.home} trail={[t.group.about]} />
      <Section>
        <Suspense>
          <BranchDirectory branches={branches} t={t} />
        </Suspense>
      </Section>
    </>
  );
}
