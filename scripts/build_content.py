#!/usr/bin/env python3
"""Build src/content/official/*.json from the crawl of https://skdccb.bank.in/ (scripts/raw/*.json).

Run:  python3 scripts/build_content.py
The crawl itself is done by scripts/{crawl_all,blocks,docs,bod}.py (Playwright).
"""
import json, re, subprocess, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
RAW = ROOT / "scripts" / "raw"
OUT = ROOT / "src" / "content" / "official"
OUT.mkdir(parents=True, exist_ok=True)

GU_LETTER = r"[અ-હ઼-્ૐૠ-ૣ]"
GU_DIGIT = r"[૦-૯0-9]"


def fix_gu(s: str) -> str:
    """Repair legacy-font artefacts in the bank's Gujarati text.

    The source CMS stores Gujarati typed with a legacy font, so a few characters
    land on the wrong code points: ૫ (digit five) instead of પ, stray ZWJ/ZWNJ inside
    conjuncts, and ઘ્ used for ધ્ / દ્ધ. Digits inside real numbers are left untouched.
    """
    if not s or not re.search(r"[઀-૿]", s):
        return s
    s = s.replace("‍", "").replace("‌", "")
    # ૫ -> પ when it sits inside a word (not part of a number)
    s = re.sub(rf"(?<!{GU_DIGIT})(?<![.,/])૫(?={GU_LETTER})", "પ", s)
    s = re.sub(rf"(?<={GU_LETTER})૫(?!{GU_DIGIT})(?![.,])", "પ", s)
    s = s.replace("ઘ્ધ", "દ્ધ").replace("ઘ્", "ધ્")
    return s


def walk_fix(o):
    if isinstance(o, str):
        return fix_gu(o)
    if isinstance(o, list):
        return [walk_fix(x) for x in o]
    if isinstance(o, dict):
        return {k: (v if k in ("href", "src", "url") else walk_fix(v)) for k, v in o.items()}
    return o


def dump(name, data):
    (OUT / name).write_text(json.dumps(walk_fix(data), ensure_ascii=False, indent=1), encoding="utf-8")
    print("wrote", name)


blocks = json.loads((RAW / "blocks.json").read_text())
main = json.loads((RAW / "main.json").read_text())
docs = json.loads((RAW / "docs.json").read_text())
bod = json.loads((RAW / "bod.json").read_text())

# ---- generic CMS pages (page/90 … page/123) -------------------------------------------------
pages = {}
for pid, v in blocks.items():
    pages[pid] = {"id": int(pid), "title": v["title"], "blocks": v["blocks"] or []}
# Mirror embedded images locally (they are posters, e.g. Customer Awareness) and record their size.
from PIL import Image  # noqa: E402

(ROOT / "public" / "official" / "cms").mkdir(parents=True, exist_ok=True)
for pg in pages.values():
    for b in pg["blocks"]:
        if b["type"] == "image" and b["src"].startswith("http"):
            name = b["src"].rsplit("/", 1)[-1]
            dest = ROOT / "public" / "official" / "cms" / name
            if not dest.exists():
                subprocess.run(["curl", "-sfL", b["src"], "-o", str(dest)], check=False)
            if dest.exists():
                w, h = Image.open(dest).size
                b.update({"src": f"/official/cms/{name}", "width": w, "height": h})
dump("pages.json", pages)

# ---- branches --------------------------------------------------------------------------------
rows = main["page/115"]["tables"][0]
head = [h.strip() for h in rows[0]]
branches = []
for r in rows[1:]:
    if len(r) < 10 or not r[1].strip():
        continue
    branches.append(
        {
            "code": r[0].strip(),
            "name": r[1].strip().title(),
            "ifsc": r[2].strip(),
            "micr": r[3].strip(),
            "address": r[4].strip().title(),
            "pincode": r[5].strip(),
            "contactName": r[6].strip().title(),
            "phone": r[7].strip(),
            "opened": r[8].strip(),
            "locker": "AVAILABLE" in r[9].upper(),
        }
    )
dump("branches.json", branches)

# ---- documents -------------------------------------------------------------------------------
def doc_list(key, group):
    return [{"title": d["t"], "url": d["h"], "group": group} for d in docs[key]]

documents = {
    "annualReports": [
        {"title": d["t"], "year": re.search(r"\d{4}-\d{4}", d["t"]).group(0), "url": d["h"]}
        for d in docs["annual-report"]
    ][::-1],
    "forms": doc_list("bank-document", "forms"),
    "lockerForms": [
        {"title": re.sub(r":?\s*Download$", "", d["t"]).strip(), "url": d["h"]} for d in docs["page/108"]
    ],
    "schemeForms": [
        {"title": re.sub(r"\s*\((Download|Downloa).*\)$", "", d["t"]).strip(), "url": d["h"]}
        for d in docs["page/111"]
    ],
}
dump("documents.json", documents)

# ---- board of directors ---------------------------------------------------------------------
board = []
for i, c in enumerate(bod["bod"], 1):
    name = c["text"][0]
    role = c["text"][1] if len(c["text"]) > 1 and c["text"][1] != name else ""
    photo = f"/official/board/{i}.png"
    dest = ROOT / "public" / "official" / "board" / f"{i}.png"
    if not dest.exists():
        subprocess.run(["curl", "-sfL", c["src"], "-o", str(dest)], check=False)
    board.append({"name": name, "role": role, "photo": photo})
dump("board.json", board)

# ---- long-form text pages (about / chairman) ------------------------------------------------
def paras(txt):
    return [p.strip() for p in re.split(r"\n\s*\n", txt) if p.strip()]

about_body = main["about"]["body"]
about_paras = [p for p in paras(about_body) if p != "History"]
chair = main["chairmans-message"]["body"]
chair_paras = paras(chair)
dump("about.json", {"history": about_paras})
dump(
    "chairman.json",
    {
        "name": chair_paras[0].split("\n")[0],
        "role": chair_paras[0].split("\n")[1].strip("| ") if "\n" in chair_paras[0] else "",
        "message": chair_paras[1] if len(chair_paras) > 1 else "",
        "points": chair_paras[2].split("\n") if len(chair_paras) > 2 else [],
    },
)

# ---- site constants (verbatim from the footer / home page) ----------------------------------
site = {
    "address": "Station Road, Himatnagar, Gujarat-383001",
    "hours": "10:00 AM - 05:00 PM, 2nd and 4th Saturday Holiday",
    "phones": ["02772-245124", "240464"],
    "email": "sabarbank@skdccb.bank.in",
    "nodalOfficer": {"name": "A G Diwan", "mobile": "9879947477", "email": "atm@skdccb.bank.in", "address": "Station Road, Himatnagar, 383001"},
    "banking": {
        "registrationNo": "24935",
        "rbiLicenceNo": "RPCD(AH) 20/2011-12",
        "ifsc": "GSCB0SKB001",
        "pan": "AAAAT1019P",
        "gst": "24AAAAT1019P1ZH",
    },
    "counters": [
        {"key": "shareCapital", "value": 5238.24, "unit": "Lakh", "icon": "share"},
        {"key": "netProfit", "value": 3303.0, "unit": "Lakh", "icon": "net"},
        {"key": "deposits", "value": 437301.49, "unit": "Lakh", "icon": "deposits"},
        {"key": "advances", "value": 253053.42, "unit": "Lakh", "icon": "advances"},
    ],
    "counterYear": "2025-26",
    "external": {
        "nivaran": "https://sanb7788.nivaran.in/",
        "positivePay": "https://gujratnbd.cedgepps.in/SABARKANTHA/#/auth/login",
        "netBanking": "https://inb.skdccb.bank.in/OnlineSKBANK/",
        "webMail": "https://outlook.office.com/",
        "lodgeComplaint": "https://cms.skdccb.bank.in/",
        "playStore": "https://play.google.com/store/apps/details?id=com.cedge.skbankconnectsync&hl=en-US",
        "appStore": "https://apps.apple.com/in/app/skbank-mobile-banking/id1574478831",
        "rbi": "https://www.rbi.org.in/",
        "cybercrime": "https://cybercrime.gov.in/",
        "incomeTax": "https://www.incometax.gov.in/iec/foportal/",
        "rbiKehtaHai": "https://www.rbi.org.in/commonman/English/scripts/rbikehtahai.aspx",
        "dicgc": "https://www.dicgc.org.in/",
        "facebook": "https://www.facebook.com/share/17X3hUbLbQ/",
    },
    "heroSlides": [f"/official/hero/{i}.webp" for i in range(1, 10)],
}
dump("site.json", site)
print("done")
