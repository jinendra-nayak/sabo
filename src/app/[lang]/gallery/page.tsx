import type { Metadata } from "next";
import { GalleryGrid } from "@/components/features/gallery-grid";
import { PageHero, Section } from "@/components/layout/page-hero";
import { getPageContext } from "@/lib/i18n/page";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getPageContext();
  return { title: t.gallery.title };
}

const images = Array.from({ length: 16 }, (_, i) => `/official/gallery/${i + 1}.webp`);

export default async function GalleryPage() {
  const { lang, t } = await getPageContext();
  return (
    <>
      <PageHero lang={lang} title={t.gallery.title} homeLabel={t.common.home} trail={[t.group.about]} />
      <Section>
        <GalleryGrid images={images} title={t.gallery.title} />
      </Section>
    </>
  );
}
