import Image from "next/image";
import { Download, ExternalLink } from "lucide-react";
import type { CmsBlock } from "@/lib/content";
import { tx } from "@/lib/i18n/translate-text";
import type { Locale } from "@/lib/i18n/config";

const BULLET = /^\s*([♦►⇒✔📌•▪●■]|\*(?=\s))\s*/u;
const LABEL_TAIL = /\s*[:\-–]?\s*(\(?\s*(Download|Downloa|Click Here)[^)]*\)?)\s*\.?\s*$/i;

/** *bold* markers that the bank's editor leaves in the text. */
function Inline({ text }: { text: string }) {
  const parts = text.split(/\*([^*\n]+)\*/g);
  return (
    <>
      {parts.map((p, i) => (i % 2 ? <strong key={i} className="font-semibold text-brand">{p}</strong> : <span key={i}>{p}</span>))}
    </>
  );
}

function DocLink({ href, label }: { href: string; label: string }) {
  const external = !href.includes("skdccb.bank.in");
  const Icon = external ? ExternalLink : Download;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-brand px-3.5 py-1.5 text-sm font-medium text-gold transition hover:bg-[#1d1d1d] hover:text-gold"
    >
      <Icon className="size-4" aria-hidden /> {label}
    </a>
  );
}

function TextLines({ text }: { text: string }) {
  const lines = text.split("\n").filter(Boolean);
  const items: React.ReactNode[] = [];
  let bullets: string[] = [];
  const flush = () => {
    if (!bullets.length) return;
    items.push(
      <ul key={`ul${items.length}`} className="my-3 space-y-2">
        {bullets.map((b, i) => (
          <li key={i} className="flex gap-3">
            <span aria-hidden className="mt-2 size-2 shrink-0 rotate-45 bg-gold" />
            <span><Inline text={b} /></span>
          </li>
        ))}
      </ul>,
    );
    bullets = [];
  };
  lines.forEach((ln, i) => {
    if (BULLET.test(ln)) bullets.push(ln.replace(BULLET, ""));
    else {
      flush();
      items.push(<p key={i} className="my-3 leading-relaxed"><Inline text={ln} /></p>);
    }
  });
  flush();
  return <>{items}</>;
}

function TableBlock({ rows: raw, lang }: { rows: string[][]; lang: Locale }) {
  const rows = raw.map((r) => r.map((c) => tx(c, lang)));
  const cols = Math.max(...rows.map((r) => r.length));
  const [head, ...body] = rows;
  const headIsHeader = head.length === cols && head.every(Boolean);
  const bodyRows = headIsHeader ? body : rows;
  return (
    <>
      {/* Phones: one card per row, so no column is ever pushed off-screen */}
      <ul className="my-6 space-y-3 sm:hidden">
        {bodyRows.map((r, ri) =>
          r.length < cols && r.length === 1 ? (
            <li key={ri} className="rounded-xl bg-gold-soft px-3 py-2 font-semibold">{r[0]}</li>
          ) : (
            <li key={ri} className="surface rounded-2xl p-3.5">
              <p className="font-semibold text-brand">{r[0]}</p>
              <dl className="mt-1.5 space-y-1 text-sm">
                {r.slice(1).map((c, ci) => (
                  <div key={ci} className="flex items-baseline justify-between gap-3">
                    <dt className="text-neutral-600">{headIsHeader ? head[ci + 1] : ""}</dt>
                    <dd className="whitespace-pre-line text-right font-medium">{c}</dd>
                  </div>
                ))}
              </dl>
            </li>
          ),
        )}
      </ul>
      <div className="surface my-6 hidden overflow-x-auto rounded-2xl sm:block">
        <table className="w-full min-w-[32rem] border-collapse text-sm">
          {headIsHeader && (
            <thead className="bg-brand text-left text-white">
              <tr>{head.map((c, i) => <th key={i} scope="col" className="px-3 py-3 font-semibold">{c}</th>)}</tr>
            </thead>
          )}
          <tbody>
            {bodyRows.map((r, ri) => (
              <tr key={ri} className="border-t border-white/60 odd:bg-white/50 even:bg-white/20 hover:bg-gold-soft/70">
                {r.length < cols && r.length === 1 ? (
                  <th colSpan={cols} scope="colgroup" className="bg-gold-soft px-3 py-2 text-left font-semibold">{r[0]}</th>
                ) : (
                  r.map((c, ci) => (
                    <td key={ci} className={`whitespace-pre-line px-3 py-2.5 align-top ${ci === 0 && !headIsHeader ? "font-semibold" : ""}`}>{c}</td>
                  ))
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export function CmsBlocks({ blocks, downloadLabel, lang }: { blocks: CmsBlock[]; downloadLabel: string; lang: Locale }) {
  return (
    <div className="text-[15.5px] text-neutral-800">
      {blocks.map((b, idx) => {
        switch (b.type) {
          case "heading": {
            if (b.links?.length) {
              return (
                <div key={idx} className="my-3 flex flex-wrap items-center justify-between gap-3 surface rounded-2xl p-3">
                  <span className="font-semibold">{tx(b.text, lang, true).replace(LABEL_TAIL, "")}</span>
                  <span className="flex gap-2">{b.links.map((l) => <DocLink key={l.href} href={l.href} label={downloadLabel} />)}</span>
                </div>
              );
            }
            return <h2 key={idx} className="mb-2 mt-8 border-l-4 border-gold pl-3 text-xl font-bold text-brand first:mt-0">{tx(b.text, lang)}</h2>;
          }
          case "p": {
            if (b.links?.length) {
              const label = tx(b.text, lang, true).replace(LABEL_TAIL, "").trim();
              return (
                <div key={idx} className="my-2 flex flex-wrap items-center justify-between gap-3 surface rounded-2xl p-3">
                  <span className="font-medium">{label || b.links[0].text}</span>
                  <span className="flex flex-wrap gap-2">{b.links.map((l) => <DocLink key={l.href} href={l.href} label={downloadLabel} />)}</span>
                </div>
              );
            }
            return <TextLines key={idx} text={tx(b.text, lang)} />;
          }
          case "table":
            return <TableBlock key={idx} rows={b.rows} lang={lang} />;
          case "image":
            return (
              <Image
                key={idx}
                src={b.src}
                alt=""
                width={b.width ?? 1000}
                height={b.height ?? 1000}
                sizes="(min-width:1024px) 600px, 100vw"
                className="mx-auto my-6 h-auto w-full max-w-xl rounded-lg shadow"
              />
            );
          case "list":
            return (
              <ul key={idx} className="my-3 list-disc space-y-1 pl-6">
                {b.items.map((it, i) => <li key={i}>{tx(it, lang)}</li>)}
              </ul>
            );
        }
      })}
    </div>
  );
}
