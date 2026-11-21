import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { PageHero, Section } from "@/components/layout/page-hero";
import { site } from "@/lib/content";
import { tx } from "@/lib/i18n/translate-text";
import { getPageContext } from "@/lib/i18n/page";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getPageContext();
  return { title: t.contact.title };
}

export default async function ContactPage() {
  const { lang, t } = await getPageContext();
  const cards = [
    { Icon: MapPin, title: t.contact.address, body: <p>{tx(site.address, lang)}</p> },
    { Icon: Phone, title: t.contact.number, body: <p>{site.phones.map((p, i) => <span key={p}>{i > 0 && ", "}<a className="hover:text-brand hover:underline" href={`tel:${p}`}>{p}</a></span>)}</p> },
    { Icon: Mail, title: t.contact.email, body: <a className="break-all hover:text-brand hover:underline" href={`mailto:${site.email}`}>{site.email}</a> },
    { Icon: Clock, title: t.contact.hours, body: <p>{tx(site.hours, lang)}</p> },
  ];
  return (
    <>
      <PageHero lang={lang} title={t.contact.title} homeLabel={t.common.home} />
      <Section>
        <h2 className="text-2xl font-bold text-brand">{t.contact.haveQuestions}</h2>
        <p className="mt-1 text-neutral-600">{t.contact.intro}</p>
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ Icon, title, body }) => (
            <li key={title} className="surface surface-hover rounded-3xl p-6">
              <span className="grid size-12 place-items-center rounded-full bg-brand text-gold"><Icon className="size-6" aria-hidden /></span>
              <h3 className="mt-4 font-semibold">{title}</h3>
              <div className="mt-1 text-sm text-neutral-700">{body}</div>
            </li>
          ))}
        </ul>
        <div className="mt-8 surface rounded-3xl border-l-4 !border-l-gold p-5">
          <h3 className="font-semibold">{t.contact.nodal}</h3>
          <p className="mt-1">{tx(site.nodalOfficer.name, lang)}</p>
          <p className="text-sm">{t.contact.mobile}: <a className="hover:underline" href={`tel:${site.nodalOfficer.mobile}`}>{site.nodalOfficer.mobile}</a> · <a className="hover:underline" href={`mailto:${site.nodalOfficer.email}`}>{site.nodalOfficer.email}</a></p>
        </div>
        <div className="mt-8 surface overflow-hidden rounded-3xl p-2">
          <iframe
            title="Map"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-80 w-full"
            src={`https://www.google.com/maps?q=${encodeURIComponent(`${t.meta.siteName}, ${site.address}`)}&output=embed`}
          />
        </div>
      </Section>
    </>
  );
}
