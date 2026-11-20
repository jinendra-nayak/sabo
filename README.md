# SKDCCB website (frontend)

Public informational website for The Sabarkantha District Central Co-Op Bank Ltd, built from the
bank's current site (https://skdccb.bank.in/). Next.js (App Router, Cache Components) · TypeScript ·
Tailwind · shadcn/ui (Base UI) · Lucide · DM Sans + Noto Sans Gujarati. Gujarati (`/gu`, default) and English (`/en`).

## Scripts
`npm run dev` · `npm run build` · `npm run start` · `npm run lint`

## Structure
```
src/
  app/[lang]/             Root layout (html lang) + routes: home, about, bod, annual-report, gallery,
                          chairmans-message, unclaim-account, branches, contact, downloads,
                          emi-calculator, [section]/[slug] (deposit, loans, service, know-more CMS pages)
  proxy.ts                "/" -> /gu or /en by Accept-Language
  components/
    ui/                   shadcn primitives
    layout/               top bar, header, dropdown + mobile nav, search, footer, page hero
    home/                 hero slider, news ticker, animated phone app showcase, count-up, service cards, popup
    cms/                  Renders scraped page blocks (paragraphs, bullets, tables, download rows)
    features/             Branch directory, document list, EMI calculator, gallery lightbox
  content/
    dictionaries/         UI text (en.ts defines the types, gu.ts must match)
    official/             JSON generated from the bank's site (do not hand-edit; re-run the build script)
  lib/                    i18n, site-map (menu + routes), content loaders
scripts/                  Playwright crawl (crawl_all, blocks, docs, bod) + build_content.py
public/official/          Images mirrored from the bank's site (logo, hero banners, gallery, board, app, icons)
```

## Refreshing content from the bank's site
```
python3 scripts/crawl_all.py <outdir>   # crawl pages          (Playwright for Python)
python3 scripts/blocks.py <outdir>      # structured page blocks
python3 scripts/docs.py <outdir>        # PDFs / forms
python3 scripts/bod.py <outdir>         # board members
cp <outdir>/{blocks,docs,main,bod}.json scripts/raw/
python3 scripts/build_content.py        # writes src/content/official/*.json (+ repairs legacy Gujarati glyphs)
```

## Notes
- PDFs/forms link to the bank's official files; Net Banking, Positive Pay, NIVARAN, mobile-app store links are the bank's own URLs.
- No login, transactions or CMS: this is the public informational site only.
- The unclaimed-accounts search runs on the bank's backend, so that page links to it.
