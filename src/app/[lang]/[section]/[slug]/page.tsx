import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AppShowcase } from "@/components/home/app-showcase";
import { CmsBlocks } from "@/components/cms/cms-blocks";
import { PageHero, Section } from "@/components/layout/page-hero";
import { getCmsPage, site } from "@/lib/content";
import { locales } from "@/lib/i18n/config";
import { getPageContext } from "@/lib/i18n/page";
import { cmsRoutes, findCmsRoute, navGroups } from "@/lib/site-map";

const groupOf = (section: string) =>
  navGroups.find((g) => g.items.some((i) => i.path.startsWith(`/${section}/`)))?.key ?? "about";

export function generateStaticParams() {
  return locales.flatMap((lang) => cmsRoutes.map((r) => ({ lang, section: r.section, slug: r.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/[section]/[slug]">): Promise<Metadata> {
  const { lang } = await getPageContext();
  const { section, slug } = await params;
  const route = findCmsRoute(section, slug);
  return { title: route?.label[lang] };
}

export default function CmsPage({ params }: PageProps<"/[lang]/[section]/[slug]">) {
  // `section` / `slug` are read inside <Suspense> so navigations show the shell instantly.
  return (
    <Suspense fallback={<div aria-busy className="mx-auto h-96 max-w-4xl animate-pulse px-4 py-12" />}>
      <CmsContent params={params} />
    </Suspense>
  );
}

async function CmsContent({ params }: { params: PageProps<"/[lang]/[section]/[slug]">["params"] }) {
  const { lang, t } = await getPageContext();
  const { section, slug } = await params;
  const route = findCmsRoute(section, slug);
  if (!route) notFound();
  const page = getCmsPage(route.pageId);
  if (!page) notFound();
  const group = groupOf(section) as keyof typeof t.group;

  // The bank's "Mobile Banking" page repeats its privacy statement; show the real app instead.
  const isMobile = route.pageId === 112;
  // Net-banking form page: add the login shortcut the bank shows in its top bar.
  const isNet = route.pageId === 113;

  // The bank writes some pages in English only, others in Gujarati only.
  const hasGu = /[઀-૿]/.test(JSON.stringify(page.blocks));
  const note = lang === "en" && hasGu ? t.common.gujaratiOnly : lang === "gu" && !hasGu && !isMobile ? t.common.englishOnly : "";

  return (
    <>
      <PageHero lang={lang} title={route.label[lang]} homeLabel={t.common.home} trail={[t.group[group]]} />
      {isMobile ? (
        <AppShowcase sub={t.home.mobileSub} titleA={t.home.mobileTitleA} titleB={t.home.mobileTitleB} text={t.home.mobileText} features={t.home.appFeatures} />
      ) : (
        <Section narrow>
          {note && <p className="mb-6 rounded-md bg-gold-soft px-3 py-2 text-sm">{note}</p>}
          <div lang={lang}>
            <CmsBlocks blocks={page.blocks} downloadLabel={t.common.download} lang={lang} />
          </div>
          {isNet && (
            <a href={site.external.netBanking} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex rounded-md bg-brand px-6 py-3 font-semibold text-gold transition hover:bg-brand hover:text-white">
              {t.mobileBanking.netBankingLogin}
            </a>
          )}
        </Section>
      )}
    </>
  );
}
