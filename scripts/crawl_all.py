import json, sys, os
from playwright.sync_api import sync_playwright
out = sys.argv[1]
base = "https://skdccb.bank.in"
paths = ["about","bod","annual-report","gallery","chairmans-message","unclaim-account","contact","bank-document","emi-calculater"] + [f"page/{i}" for i in range(90,124)]
js = """() => {
  const m = document.querySelector('main, .content, .page-content, section') ;
  const tables = [...document.querySelectorAll('table')].map(t => [...t.rows].map(r => [...r.cells].map(c => c.innerText.trim().replace(/\\s+/g,' '))));
  const links = [...document.querySelectorAll('a')].map(a => ({t:a.innerText.trim().replace(/\\s+/g,' '), h:a.href})).filter(l => /\\.(pdf|docx?|xlsx?|jpg|png)/i.test(l.h) || /upload/.test(l.h));
  const imgs = [...document.querySelectorAll('img')].map(i => i.currentSrc||i.src);
  const h = [...document.querySelectorAll('h1,h2,h3,h4')].map(x => x.innerText.trim());
  return {title: document.title, h, tables, links, imgs};
}"""
res = {}
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width":1440,"height":900})
    for path in paths:
        name = path.replace("/","_")
        try:
            pg.goto(f"{base}/{path}", wait_until="networkidle", timeout=60000)
            # scroll to trigger lazy content
            pg.evaluate("window.scrollTo(0, document.body.scrollHeight)"); pg.wait_for_timeout(800)
            d = pg.evaluate(js)
            d["text"] = pg.inner_text("body")
            res[path] = d
            pg.screenshot(path=f"{out}/{name}.png", full_page=True)
            print("ok", path, len(d["text"]), len(d["tables"]), len(d["links"]))
        except Exception as e:
            print("ERR", path, e)
    b.close()
json.dump(res, open(f"{out}/all.json","w"), ensure_ascii=False, indent=1)
