import type { Metadata } from "next";
import Image from "next/image";
import { PageHero, Section } from "@/components/layout/page-hero";
import { Reveal } from "@/components/home/reveal";
import { board } from "@/lib/content";
import { tx } from "@/lib/i18n/translate-text";
import { getPageContext } from "@/lib/i18n/page";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getPageContext();
  return { title: t.bod.title };
}

export default async function BodPage() {
  const { lang, t } = await getPageContext();
  return (
    <>
      <PageHero lang={lang} title={t.bod.title} homeLabel={t.common.home} trail={[t.group.about]} />
      <Section>
        <ul className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {board.map((m, i) => (
            <Reveal as="li" key={m.photo} delay={(i % 4) * 80}>
              <article className="surface surface-hover group overflow-hidden rounded-3xl text-center">
                <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
                  <Image src={m.photo} alt="" fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover object-top transition duration-500 group-hover:scale-105" />
                </div>
                <div className="border-t-4 border-gold p-4">
                  <h3 className="font-semibold leading-snug text-brand">{tx(m.name, lang)}</h3>
                  {m.role && <p className="mt-1 text-sm text-neutral-600">{tx(m.role, lang)}</p>}
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      </Section>
    </>
  );
}
