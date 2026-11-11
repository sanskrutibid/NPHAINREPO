// Downloads the real logo, client logos and team photos from the live site into src/assets/images.
import fs from 'fs';import path from 'path';
const B='https://phianinfotec.com/assets/';const F={
 "phian-logo.png": "white-color-logo.png",
 "team/dev.webp": "dev.webp",
 "team/yamini.jpeg": "yamini.jpeg",
 "team/gunjan.png": "gunjan.png",
 "team/neha.jpeg": "neha.jpeg",
 "team/chinmayee.jpeg": "chinmayee.jpeg",
 "team/rajeshwari.jpeg": "rajeshwari.jpeg",
 "team/payal.png": "payal.png",
 "team/dhanashree.jpeg": "dhanashree.jpeg",
 "team/sunny.jpeg": "sunny.jpeg",
 "team/bhakti.png": "bhakti.png"
};
for(const [out,src] of Object.entries(F)){const p=path.join('src','assets','images',out);if(fs.existsSync(p))continue;
 try{const r=await fetch(B+src);if(!r.ok)throw new Error(r.status);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,Buffer.from(await r.arrayBuffer()));console.log('saved',out);}
 catch(e){console.warn('skipped',out,String(e));}}
