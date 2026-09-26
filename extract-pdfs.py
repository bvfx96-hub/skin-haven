from pypdf import PdfReader
from pathlib import Path
import json
out=Path('content/pdf'); out.mkdir(parents=True,exist_ok=True)
assets=Path('assets/treatments'); assets.mkdir(parents=True,exist_ok=True)
data=[]
for n in range(1,10):
    reader=PdfReader(f'C:/Users/Admin/Downloads/{n:02}.pdf')
    text='\n'.join(p.extract_text() or '' for p in reader.pages)
    images=[]
    for pi,p in enumerate(reader.pages):
        for ii,img in enumerate(p.images):
            name=f'pdf-{n:02}-{pi}-{ii}'+Path(img.name).suffix
            (assets/name).write_bytes(img.data)
            images.append(str(assets/name))
    (out/f'{n:02}.txt').write_text(text,encoding='utf8')
    data.append(dict(id=n,text=text,images=images))
    print(n,len(reader.pages),len(text),images,text[:450].replace('\n',' '))
(out/'extracted.json').write_text(json.dumps(data,ensure_ascii=False),encoding='utf8')
