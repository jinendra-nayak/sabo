import json
from playwright.sync_api import sync_playwright
JS = r"""()=>{
 const root=document.querySelector('.why-choose-two__right'); if(!root) return null;
 const clean=s=>s.replace(/ /g,' ').replace(/[ \t]+/g,' ').replace(/\s*\n\s*/g,'\n').trim();
 const abs=h=>h.replace('https://skdccb.bank.in/page/skdccb.bank.in','https://skdccb.bank.in');
 const out=[];
 const walk=(n)=>{
  for(const c of n.children){
   const tag=c.tagName;
   if(tag==='TABLE'){ out.push({type:'table',rows:[...c.rows].map(r=>[...r.cells].map(x=>clean(x.innerText)))}); continue;}
   if(c.querySelector && c.querySelector('table') && tag!=='P'){ walk(c); continue;}
   if(tag==='UL'||tag==='OL'){ out.push({type:'list',items:[...c.children].map(li=>clean(li.innerText))}); continue;}
   if(/^H[1-6]$/.test(tag)){ const t=clean(c.innerText); if(t) out.push({type:'heading',text:t}); continue;}
   if(tag==='IMG'){ out.push({type:'image',src:c.currentSrc||c.src}); continue;}
   const links=[...c.querySelectorAll('a[href]')].map(a=>({text:clean(a.innerText),href:abs(a.href)})).filter(l=>/^https?:/.test(l.href));
   const hasBlockKids=[...c.children].some(k=>/^(DIV|P|UL|OL|TABLE|H[1-6])$/.test(k.tagName));
   if((tag==='DIV'||tag==='SECTION') && hasBlockKids){ walk(c); continue;}
   const t=clean(c.innerText);
   const imgs=[...c.querySelectorAll('img')].map(i=>i.currentSrc||i.src);
   if(t){ const strong=c.children.length>0&&[...c.querySelectorAll('strong,b')].map(s=>clean(s.innerText)).join(' ')===t; out.push({type:strong?'heading':'p',text:t,links}); }
   else if(imgs.length){ imgs.forEach(src=>out.push({type:'image',src})); }
  }
 };
 walk(root); return out;
}"""
res={}
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={"width":1440,"height":900})
    for i in range(90,124):
        pg.goto(f"https://skdccb.bank.in/page/{i}", wait_until="networkidle")
        title=pg.evaluate("()=>{const e=[...document.querySelectorAll('h1,h2')].find(x=>x.innerText.trim()); return e?e.innerText.trim():''}")
        res[str(i)]={"title":title,"blocks":pg.evaluate(JS)}
        print(i,title,len(res[str(i)]["blocks"] or []))
    b.close()
json.dump(res,open(__import__('sys').argv[1]+"/blocks.json","w"),ensure_ascii=False,indent=1)
