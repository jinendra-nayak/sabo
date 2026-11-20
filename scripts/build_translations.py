#!/usr/bin/env python3
"""Join scripts/i18n/todo_*.tsv (source lines) with gu_*.tsv / en_*.tsv (translations, same ids)
into src/content/translations/{en2gu,gu2en}.json  ({source line: translation}).
Run: python3 scripts/build_translations.py
"""
import json, glob, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
I18N = ROOT / "scripts" / "i18n"
OUT = ROOT / "src" / "content" / "translations"
OUT.mkdir(parents=True, exist_ok=True)

def read(path):
    d = {}
    for ln in open(path, encoding="utf-8"):
        ln = ln.rstrip("\n")
        if "\t" in ln:
            k, v = ln.split("\t", 1)
            d[k] = v
    return d

def read_pairs(path):
    d = {}
    for ln in open(path, encoding="utf-8"):
        ln = ln.rstrip("\n")
        if "\t" in ln:
            a, b = ln.split("\t", 1)
            d[a] = b
    return d

for src, tgt, prefix in (("en", "gu", "gu_"), ("gu", "en", "en_")):
    todo = read(I18N / f"todo_{src}2{tgt}.tsv")
    tr = {}
    for f in sorted(glob.glob(str(I18N / f"{prefix}*.tsv"))):
        tr.update(read(f))
    extra = {}
    for f in sorted(glob.glob(str(I18N / f"extra_{src}2{tgt}.tsv"))):
        extra.update(read_pairs(f))
    out = {todo[k]: v for k, v in tr.items() if k in todo and v.strip()}
    out.update(extra)
    (OUT / f"{src}2{tgt}.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"{src}->{tgt}: {len(out)}/{len(todo)} translated")
