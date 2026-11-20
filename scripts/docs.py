import json, sys
from playwright.sync_api import sync_playwright
out=sys.argv[1]
js="""()=>[...document.querySelectorAll('a[href]')].filter(a=>/\\.(pdf|docx?|xlsx?)(\\?|$)/i.test(a.href)).map(a=>{
  let n=a; let txt=a.innerText.trim();
  for(let i=0;i<4 && (!txt || /^(download|click here)$/i.test(txt)) ;i++){ n=n.parentElement; if(!n)break; txt=n.innerText.trim().replace(/\\s+/g,' ');}
  return {t:txt.slice(0,160), h:a.href.replace('https://skdccb.bank.in/page/skdccb.bank.in','https://skdccb.bank.in')}})"""
res={}
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page()
    for path in ["bank-document","annual-report","page/108","page/111","page/113","page/98","page/90","page/91","page/102","page/103"]:
        pg.goto("https://skdccb.bank.in/"+path, wait_until="networkidle")
        res[path]=pg.evaluate(js)
    pg.goto("https://skdccb.bank.in/", wait_until="networkidle"); pg.wait_for_timeout(1500)
    res["_home_services"]=pg.evaluate("""()=>[...document.querySelectorAll('.owl-item:not(.cloned) a[href*="page/"], .swiper-slide a[href*="page/"]')].map(a=>({h:a.href,t:a.closest('div').innerText.trim().replace(/\\s+/g,' ').slice(0,100)}))""")
    res["_home_hero"]=pg.evaluate("""()=>[...document.querySelectorAll('img')].map(i=>i.currentSrc||i.src).filter(s=>/slider_img/.test(s))""")
    b.close()
json.dump(res,open(out+"/docs.json","w"),ensure_ascii=False,indent=1)
for k,v in res.items():
    print(k,len(v))
    for x in v[:40]: print("   ",x if isinstance(x,str) else (x.get('t'),'|',x['h'][-40:]))
