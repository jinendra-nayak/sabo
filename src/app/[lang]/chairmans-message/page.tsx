import type { Metadata } from "next";
import Image from "next/image";
import { PageHero, Section } from "@/components/layout/page-hero";
import { board, chairman } from "@/lib/content";
import { tx } from "@/lib/i18n/translate-text";
import { getPageContext } from "@/lib/i18n/page";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getPageContext();
  return { title: t.about.chairman };
}

export default async function ChairmanPage() {
  const { lang, t } = await getPageContext();
  return (
    <>
      <PageHero lang={lang} title={t.about.chairman} homeLabel={t.common.home} trail={[t.group.about]} />
      <Section narrow>
                <div className="grid gap-8 md:grid-cols-[14rem_1fr]">
          <figure className="text-center">
            <div className="relative mx-auto aspect-[4/5] w-48 overflow-hidden rounded-2xl border-4 border-gold shadow-lg md:w-full">
              <Image src={board[0].photo} alt={board[0].name} fill sizes="224px" className="object-cover object-top" />
            </div>
            <figcaption className="mt-3">
              <p lang={lang} className="font-semibold text-brand">{tx(chairman.name, lang)}</p>
              <p lang={lang} className="text-sm text-neutral-600">{tx(chairman.role, lang)}</p>
            </figcaption>
          </figure>
          <div lang={lang} className="leading-loose text-neutral-800">
            <p className="text-justify">{tx(chairman.message, lang)}</p>
            <ul className="mt-5 space-y-2">
              {chairman.points.map((p, i) => (
                <li key={i} className="flex gap-3">
                  <span aria-hidden className="mt-3 size-2 shrink-0 rotate-45 bg-gold" />
                  <span>{tx(p, lang)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </>
  );
}
