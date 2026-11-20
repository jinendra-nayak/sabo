import json
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={"width":1440,"height":900})
    pg.goto("https://skdccb.bank.in/bod", wait_until="networkidle")
    cards=pg.evaluate("""()=>[...document.querySelectorAll('img')].filter(i=>/upload/.test(i.src)).map(i=>{let n=i.parentElement;for(let k=0;k<4&&n&&!/\\n/.test(n.innerText.trim());k++)n=n.parentElement;return {src:i.currentSrc||i.src,text:(n?n.innerText.trim():'').split('\\n').map(s=>s.trim()).filter(Boolean)}})""")
    pg.goto("https://skdccb.bank.in/chairmans-message", wait_until="networkidle")
    cm=pg.evaluate("""()=>[...document.querySelectorAll('img')].filter(i=>/upload/.test(i.src)).map(i=>i.currentSrc||i.src)""")
    pg.goto("https://skdccb.bank.in/about", wait_until="networkidle")
    ab=pg.evaluate("""()=>[...document.querySelectorAll('img')].map(i=>i.currentSrc||i.src).filter(s=>!/logo/.test(s))""")
    b.close()
json.dump({"bod":cards,"chairman_imgs":cm,"about_imgs":ab},open("/tmp/claude-1000/-home-jinendra/e95481f8-2382-4aae-879b-8c8e50acfaa0/scratchpad/crawl/bod.json","w"),ensure_ascii=False,indent=1)
for c in cards: print(c)
print(cm); print(ab)
