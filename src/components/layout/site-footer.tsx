import Image from "next/image";
import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/content/dictionaries/en";
import { navGroups } from "@/lib/site-map";
import { site } from "@/lib/content";

export function SiteFooter({ lang, t }: { lang: Locale; t: Dictionary }) {
  const x = site.external;
  const b = site.banking;
  const ext = { target: "_blank", rel: "noopener noreferrer" } as const;
  const li = "text-white/80 transition hover:text-gold";
  return (
    <footer className="mt-16 bg-gradient-to-br from-brand-dark via-[#14281a] to-[#0c1710] text-white shadow-2xl">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Image src="/official/brand/logo.png" alt={t.meta.siteName} width={684} height={292} className="h-28 w-auto rounded-lg bg-white" />
          <p className="flex gap-2 text-sm text-white/85"><MapPin className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />{site.address}</p>
          <p className="flex gap-2 text-sm text-white/85"><Clock className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />{site.hours}</p>
          <p className="flex gap-2 text-sm text-white/85">
            <Phone className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
            <span>{site.phones.map((p, i) => (<span key={p}>{i > 0 && ", "}<a href={`tel:${p.replace(/\s/g, "")}`} className={li}>{p}</a></span>))}</span>
          </p>
          <p className="flex gap-2 text-sm"><Mail className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden /><a href={`mailto:${site.email}`} className={li}>{site.email}</a></p>
          <div className="rounded-md bg-white/5 p-3 text-sm">
            <p className="font-semibold text-gold">{t.contact.nodal}</p>
            <p>{site.nodalOfficer.name}</p>
            <p>{t.contact.mobile}: <a href={`tel:${site.nodalOfficer.mobile}`} className={li}>{site.nodalOfficer.mobile}</a></p>
            <p><a href={`mailto:${site.nodalOfficer.email}`} className={li}>{site.nodalOfficer.email}</a></p>
          </div>
        </div>

        <nav aria-label={t.footer.resources}>
          <h2 className="mb-4 text-lg font-semibold text-gold">{t.footer.resources}</h2>
          <ul className="space-y-2 text-sm">
            <li><Link className={li} href={`/${lang}/contact`}>{t.footer.contactUs}</Link></li>
            <li><Link className={li} href={`/${lang}/unclaim-account`}>{t.footer.unclaim}</Link></li>
            <li><Link className={li} href={`/${lang}/downloads`}>{t.footer.downloadForm}</Link></li>
            <li><Link className={li} href={`/${lang}/emi-calculator`}>{t.footer.emi}</Link></li>
            <li><a className={li} href={x.nivaran} {...ext}>{t.top.nivaran}</a></li>
            <li><a className={li} href={x.rbi} {...ext}>{t.footer.rbi}</a></li>
            <li><a className={li} href={x.cybercrime} {...ext}>{t.footer.cyber}</a></li>
            <li><a className={li} href={x.incomeTax} {...ext}>{t.footer.incomeTax}</a></li>
            <li><a className={li} href={x.rbiKehtaHai} {...ext}>{t.footer.rbiKehta}</a></li>
          </ul>
        </nav>

        <nav aria-label="Site">
          <h2 className="mb-4 text-lg font-semibold text-gold">{t.group.knowMore}</h2>
          <ul className="space-y-2 text-sm">
            {navGroups.find((g) => g.key === "knowMore")!.items.map((i) => (
              <li key={i.path}><Link className={li} href={`/${lang}${i.path}`}>{i.label[lang]}</Link></li>
            ))}
            <li><a className={li} href={x.lodgeComplaint} {...ext}>{t.top.lodgeComplaint}</a></li>
          </ul>
        </nav>

        <div className="space-y-5">
          <div>
            <h2 className="mb-3 text-lg font-semibold text-gold">{t.footer.bankingDetails}</h2>
            <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
              <dt className="text-white/70">{t.footer.regNo}</dt><dd>{b.registrationNo}</dd>
              <dt className="text-white/70">{t.footer.rbiLicense}</dt><dd>{b.rbiLicenceNo}</dd>
              <dt className="text-white/70">{t.footer.ifsc}</dt><dd>{b.ifsc}</dd>
              <dt className="text-white/70">{t.footer.pan}</dt><dd>{b.pan}</dd>
              <dt className="text-white/70">{t.footer.gst}</dt><dd>{b.gst}</dd>
            </dl>
          </div>
          <div>
            <h2 className="mb-3 text-lg font-semibold text-gold">{t.footer.dicgc}</h2>
            <div className="flex items-center gap-3 rounded-md bg-white p-2">
              <Image src="/official/brand/dicgc.png" alt="DICGC" width={105} height={105} className="size-12" />
              <Image src="/official/brand/dicgc-qr.png" alt="DICGC QR" width={64} height={64} className="size-14" />
            </div>
            <p className="mt-2 text-sm text-white/80">{t.footer.dicgcText}</p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/70">
        © {t.meta.siteName} · {t.footer.rights}
      </div>
    </footer>
  );
}
