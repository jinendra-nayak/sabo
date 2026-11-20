#!/usr/bin/env python3
"""List every unique line of bank content that needs translating (EN->GU and GU->EN).

Writes scripts/i18n/todo_en2gu.tsv and todo_gu2en.tsv  (id <TAB> source line).
Lines are split on newlines, leading list markers removed, and "Download / Click Here" tails stripped,
exactly like src/lib/i18n/translate-text.ts does at render time.
"""
import json, re, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
GU = re.compile(r"[઀-૿]")
LAT = re.compile(r"[A-Za-z]")
MARK = re.compile(r"^\s*([♦►⇒✔📌•▪●■]|\*(?=\s))\s*")
TAIL = re.compile(r"\s*[:\-–]?\s*(\(?\s*(Download|Downloa|Click Here)[^)]*\)?)\s*\.?\s*$", re.I)
SKIP_PAGES = {"112", "115"}

def lang_of(line):
    g = len(GU.findall(line)); l = len(LAT.findall(line))
    if g + l == 0: return None
    return "gu" if g >= l else "en"

def lines_of(text, strip_tail=False):
    if strip_tail: text = TAIL.sub("", text)
    for ln in text.split("\n"):
        ln = MARK.sub("", ln).strip()
        if ln: yield ln

pages = json.load(open(ROOT / "src/content/official/pages.json"))
docs = json.load(open(ROOT / "src/content/official/documents.json"))
srcs = {"en": {}, "gu": {}}
def add(text, strip_tail=False):
    for ln in lines_of(text, strip_tail):
        k = lang_of(ln)
        if k: srcs[k].setdefault(ln, 0)

for pid, pg in pages.items():
    if pid in SKIP_PAGES: continue
    for b in pg["blocks"]:
        if b["type"] in ("p", "heading"): add(b["text"], bool(b.get("links")))
        elif b["type"] == "table":
            for r in b["rows"]:
                for c in r: add(c)
for key in ("forms", "lockerForms", "schemeForms"):
    for d in docs[key]: add(d["title"])
about = json.load(open(ROOT / "src/content/official/about.json"))
chair = json.load(open(ROOT / "src/content/official/chairman.json"))
for p in about["history"]: add(p)
add(chair["message"]); [add(x) for x in chair["points"]]
# page titles (needed for English/Gujarati nav labels are in site-map, not here)

out = ROOT / "scripts/i18n"
for src, tgt in (("en", "gu"), ("gu", "en")):
    items = sorted(srcs[src], key=lambda s: (len(s) > 120, s))
    with open(out / f"todo_{src}2{tgt}.tsv", "w", encoding="utf-8") as f:
        for i, s in enumerate(items, 1):
            f.write(f"{src[0]}{i}\t{s}\n")
    print(src, "->", tgt, len(items), "lines,", sum(map(len, items)), "chars")
