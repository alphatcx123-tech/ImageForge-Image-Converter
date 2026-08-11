const translations={
  vi:{
    brandSub:"IMAGE CONVERTER",darkMode:"Tối",lightMode:"Sáng",
    files:"Tệp",convertAll:"Chuyển đổi tất cả",downloadAll:"Tải tất cả",clear:"Xóa",
    addFiles:"+ Thêm tệp",dropHint:"Kéo thả tệp vào đây hoặc bấm để chọn",
    settings:"Cài đặt chuyển đổi",outputFormat:"Định dạng đầu ra",
    qualityMode:"Chất lượng",custom:"Thanh kéo — Tùy chỉnh",width:"Chiều rộng (px)",
    height:"Chiều cao (px)",convertAllFiles:"Chuyển đổi tất cả tệp",
    localInfo:"Tệp được xử lý cục bộ bằng JavaScript. Không cần tải lên máy chủ.",
    footer:"Chuyển đổi ảnh cục bộ",ready:"Sẵn sàng",empty:"Chưa có tệp nào.",
    emptyImages:"Chưa có ảnh nào được chọn.",convert:"Chuyển",remove:"Xóa",download:"Tải",
    reading:"Đang đọc ảnh…",done:"Hoàn tất",unknown:"không xác định",error:"Lỗi"
  },
  en:{
    brandSub:"IMAGE CONVERTER",darkMode:"Dark",lightMode:"Light",
    files:"Files",convertAll:"Convert all",downloadAll:"Download all",clear:"Clear",
    addFiles:"+ Add files",dropHint:"Drag & drop files here or click to browse",
    settings:"Conversion settings",outputFormat:"Output format",
    qualityMode:"Quality",custom:"Slider — Custom",width:"Width (px)",
    height:"Height (px)",convertAllFiles:"Convert all files",
    localInfo:"Files are processed locally with JavaScript. Nothing is uploaded to a server.",
    footer:"Local image conversion",ready:"Ready",empty:"No files added yet.",
    emptyImages:"No images selected.",convert:"Convert",remove:"Remove",download:"Download",
    reading:"Reading image…",done:"Done",unknown:"unknown",error:"Error"
  }
};
const themeToggle=document.getElementById("themeToggle");
const themeIcon=document.getElementById("themeIcon");
const themeText=document.getElementById("themeText");
const languageSelect=document.getElementById("languageSelect");

function applyTheme(theme){
  const light=theme==="light";
  document.documentElement.dataset.theme=theme;
  if(light){
    document.documentElement.style.setProperty("--bg","#f4f7fb");
    document.documentElement.style.setProperty("--panel","#ffffff");
    document.documentElement.style.setProperty("--panel2","#f1f4f8");
    document.documentElement.style.setProperty("--line","#dce3eb");
    document.documentElement.style.setProperty("--text","#17202b");
    document.documentElement.style.setProperty("--muted","#657384");
    document.documentElement.style.setProperty("--header","rgba(255,255,255,.88)");
  }else{
    document.documentElement.style.setProperty("--bg","#0b0e12");
    document.documentElement.style.setProperty("--panel","#11161c");
    document.documentElement.style.setProperty("--panel2","#171d24");
    document.documentElement.style.setProperty("--line","#27303a");
    document.documentElement.style.setProperty("--text","#eef2f6");
    document.documentElement.style.setProperty("--muted","#8d99a6");
    document.documentElement.style.setProperty("--header","rgba(13,17,22,.88)");
  }
  themeIcon.textContent=light?"☀":"☾";
  themeText.textContent=translations[languageSelect.value][light?"lightMode":"darkMode"];
  localStorage.setItem("imageforge-theme",theme);
}
function applyLanguage(lang){
  const t=translations[lang]||translations.vi;
  document.documentElement.lang=lang;
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const key=el.dataset.i18n;
    if(t[key]!==undefined) el.textContent=t[key];
  });
  themeText.textContent=t[document.documentElement.dataset.theme==="light"?"lightMode":"darkMode"];
  localStorage.setItem("imageforge-language",lang);
  if(typeof render==="function") render();
}
themeToggle.addEventListener("click",()=>{
  applyTheme(document.documentElement.dataset.theme==="light"?"dark":"light");
});
languageSelect.addEventListener("change",()=>applyLanguage(languageSelect.value));

const savedLang=localStorage.getItem("imageforge-language") ||
  (navigator.language||"vi").toLowerCase().startsWith("vi")?"vi":"en";
languageSelect.value=savedLang;
const savedTheme=localStorage.getItem("imageforge-theme") || "dark";
applyTheme(savedTheme);
applyLanguage(savedLang);

const $=s=>document.querySelector(s);
const fileInput=$("#files"),drop=$("#drop"),list=$("#filesList");
const format=$("#format"),quality=$("#quality"),qualityValue=$("#qualityValue");
const width=$("#width"),height=$("#height"),convertBtn=$("#convert");
const qualityPreset=$("#qualityPreset");
const downloadAllBtn=$("#downloadAll");
let items=[], outputs=[];
const resolutionPresets=[144,240,360,480,720,1080,1440,2160,"original"];

function updateQualityValue(){
  if(!quality||!qualityValue)return;
  const value=Math.max(1,Math.min(100,Number(quality.value)||92));
  qualityValue.textContent=`${value}%`;
  // Giữ giá trị hiện tại để các phần khác của app luôn dùng cùng một mức.
  quality.setAttribute("aria-valuenow",String(value));
}

// Cập nhật ngay trong lúc kéo, không chờ thả chuột.
updateQualityValue();
if(quality){
  quality.oninput=updateQualityValue;
  quality.onchange=updateQualityValue;
  quality.addEventListener("pointermove",updateQualityValue);
}

if(width)width.addEventListener("input",()=>{
  if(qualityPreset)qualityPreset.value="custom";
});
if(height)height.addEventListener("input",()=>{
  if(qualityPreset)qualityPreset.value="custom";
});

if(qualityPreset)qualityPreset.addEventListener("change",()=>{
  const v=qualityPreset.value;
  if(v!=="custom"){
    if(width)width.value="";
    if(height)height.value="";
  }
});

drop.addEventListener("click",()=>fileInput.click());
fileInput.addEventListener("change",e=>addFiles([...e.target.files]));
["dragenter","dragover"].forEach(ev=>drop.addEventListener(ev,e=>{
 e.preventDefault();drop.classList.add("drag");
}));
["dragleave","drop"].forEach(ev=>drop.addEventListener(ev,e=>{
 e.preventDefault();drop.classList.remove("drag");
}));
drop.addEventListener("drop",e=>addFiles([...e.dataTransfer.files]));

function addFiles(files){
 const imgs=files;
 for(const f of imgs){
   items.push({file:f,url:URL.createObjectURL(f),result:null});
 }
 render();
}

function fmtBytes(n){
 if(n<1024)return n+" B";
 if(n<1048576)return (n/1024).toFixed(1)+" KB";
 if(n<1073741824)return (n/1048576).toFixed(2)+" MB";
 return (n/1073741824).toFixed(2)+" GB";
}

function extFromMime(m){
 return ({'image/png':'png','image/jpeg':'jpg','image/webp':'webp',
 'image/avif':'avif','image/bmp':'bmp','image/gif':'gif','image/tiff':'tiff','image/apng':'apng','image/x-icon':'ico','image/svg+xml':'svg','image/x-tga':'tga','image/x-portable-pixmap':'ppm','image/x-portable-graymap':'pgm','image/x-portable-bitmap':'pbm','image/x-portable-anymap':'pam','image/qoi':'qoi','image/vnd.zbrush.pcx':'pcx','image/vnd-ms.dds':'dds','image/vnd.radiance':'hdr','image/x-sgi':'sgi','application/fits':'fits','image/x-miff':'miff'})[m]||'img';
}

function render(){
 if(!items.length){
   list.innerHTML='<div class="empty">'+translations[languageSelect.value].emptyImages+'</div>';
   downloadAllBtn.disabled=true; return;
 }
 list.innerHTML=items.map((x,i)=>`
 <div class="file-item">
   <img class="thumb" src="${x.url}">
   <div>
     <div class="name">${escapeHTML(x.file.name)}</div>
     <div class="meta">${escapeHTML(x.file.type||"unknown")} • ${fmtBytes(x.file.size)}</div>
     <div class="status" id="status-${i}">${translations[languageSelect.value].ready}</div>
     <div class="progress"><i id="prog-${i}"></i></div>
   </div>
   <div class="actions">
     <button onclick="convertOne(${i})">Chuyển</button>
     <button onclick="removeItem(${i})">Xóa</button>
     <button id="dl-${i}" disabled onclick="downloadOne(${i})">Tải</button>
   </div>
 </div>`).join("");
}

function escapeHTML(s){
 return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function getDimensions(img){
 let w=parseInt(width.value)||0;
 let h=parseInt(height.value)||0;
 const ow=img.naturalWidth, oh=img.naturalHeight;
 const preset=qualityPreset.value;

 // Nếu chọn preset độ phân giải, scale theo cạnh dài,
 // giữ nguyên aspect ratio và không upscale ảnh nhỏ.
 if(preset!=="custom" && preset!=="original" && !w && !h){
   const target=parseInt(preset);
   const longSide=Math.max(ow,oh);
   const scale=Math.min(1,target/longSide);
   w=Math.max(1,Math.round(ow*scale));
   h=Math.max(1,Math.round(oh*scale));
 }

 if(preset==="original" && !w && !h){
   w=ow;h=oh;
 }

 if(!w && !h){w=ow;h=oh;}
 if(w && !h) h=Math.round(w*oh/ow);
 if(h && !w) w=Math.round(h*ow/oh);

 return {w,h};
}

function loadImage(url){
 return new Promise((resolve,reject)=>{
  const img=new Image();
  img.onload=()=>resolve(img);img.onerror=reject;img.src=url;
 });
}



function rgbaCanvasFromPixels(width,height,rgba){
  const canvas=document.createElement("canvas");
  canvas.width=width; canvas.height=height;
  const ctx=canvas.getContext("2d");
  ctx.putImageData(new ImageData(new Uint8ClampedArray(rgba),width,height),0,0);
  return canvas;
}

async function decodeTGA(file){
  if(typeof TGA==="undefined") throw new Error("TGA decoder chưa được tải.");
  const buf=await file.arrayBuffer();
  const tga=new TGA();
  tga.load(new Uint8Array(buf));
  const image=tga.getImageData();
  return new Promise((resolve,reject)=>{
    const canvas=rgbaCanvasFromPixels(tga.header.width,tga.header.height,image);
    canvas.toBlob(b=>b?resolve(b):reject(new Error("Không tạo được PNG từ TGA.")),"image/png");
  });
}

async function decodeSVG(file){
  const text=await file.text();
  if(!/<svg[\s>]/i.test(text)) throw new Error("SVG không hợp lệ.");
  const blob=new Blob([text],{type:"image/svg+xml"});
  return blob;
}


async function canvasToTiffBlob(canvas){
  if(typeof UTIF==="undefined") throw new Error("TIFF encoder chưa được tải.");
  const rgba=canvas.getContext("2d").getImageData(0,0,canvas.width,canvas.height).data;
  const rgbaCopy=new Uint8Array(rgba);
  const tiff=UTIF.encodeImage(rgbaCopy,canvas.width,canvas.height);
  return new Blob([tiff],{type:"image/tiff"});
}

function canvasToGifBlob(canvas){
  return new Promise((resolve,reject)=>{
    if(typeof GIF==="undefined"){
      reject(new Error("GIF encoder chưa được tải."));
      return;
    }
    const gif=new GIF({
      workers:2,
      quality:5,
      width:canvas.width,
      height:canvas.height,
      workerScript:"https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.worker.js"
    });
    gif.addFrame(canvas,{copy:true,delay:100});
    gif.on("finished",blob=>resolve(blob));
    gif.on("abort",()=>reject(new Error("GIF encoder bị hủy.")));
    gif.render();
  });
}

function writeU16BE(a,o,v){a[o]=(v>>8)&255;a[o+1]=v&255}
function writeU32BE(a,o,v){a[o]=(v>>>24)&255;a[o+1]=(v>>>16)&255;a[o+2]=(v>>>8)&255;a[o+3]=v&255}

function makeAPNGChunk(type,data){
  const t=new TextEncoder().encode(type);
  const out=new Uint8Array(12+t.length+data.length);
  writeU32BE(out,0,data.length);
  out.set(t,4);out.set(data,8);
  let crc=0xFFFFFFFF;
  for(let i=4;i<8+data.length;i++){
    crc^=out[i];
    for(let k=0;k<8;k++)crc=(crc>>>1)^((crc&1)?0xEDB88320:0);
  }
  writeU32BE(out,8+data.length,(crc^0xFFFFFFFF)>>>0);
  return out;
}

function canvasToApngBlob(canvas){
  // Single-frame APNG: valid PNG/APNG structure with acTL/fcTL.
  // The IDAT payload is taken from a browser-generated PNG.
  return new Promise((resolve,reject)=>{
    canvas.toBlob(async png=>{
      try{
        if(!png)throw new Error("Không tạo được PNG.");
        const bytes=new Uint8Array(await png.arrayBuffer());
        const sig=bytes.slice(0,8);
        let pos=8, ihdr=null, idatParts=[], other=[];
        while(pos+8<=bytes.length){
          const len=(bytes[pos]<<24)|(bytes[pos+1]<<16)|(bytes[pos+2]<<8)|bytes[pos+3];
          const type=new TextDecoder().decode(bytes.slice(pos+4,pos+8));
          const data=bytes.slice(pos+8,pos+8+len);
          if(type==="IHDR")ihdr=data;
          else if(type==="IDAT")idatParts.push(data);
          else if(type!=="IEND")other.push({type,data});
          pos+=12+len;
        }
        if(!ihdr)throw new Error("PNG header không hợp lệ.");

        const ihdrAPNG=ihdr.slice();
        // Keep PNG color info, only frame count needs APNG chunks.
        const acTL=new Uint8Array(8);writeU32BE(acTL,0,1);writeU32BE(acTL,4,0);
        const fcTL=new Uint8Array(26);
        writeU32BE(fcTL,0,0); // sequence
        fcTL.set(ihdrAPNG.slice(0,8),4); // width/height
        writeU32BE(fcTL,12,0);writeU32BE(fcTL,16,0); // x/y
        writeU16BE(fcTL,20,1);writeU16BE(fcTL,22,10); // delay 1/10 sec
        fcTL[24]=0;fcTL[25]=0; // dispose/source blend

        const chunks=[
          makeAPNGChunk("IHDR",ihdr),
          makeAPNGChunk("acTL",acTL),
          makeAPNGChunk("fcTL",fcTL)
        ];
        for(const d of idatParts)chunks.push(makeAPNGChunk("IDAT",d));
        chunks.push(makeAPNGChunk("IEND",new Uint8Array()));
        let total=8;for(const c of chunks)total+=c.length;
        const out=new Uint8Array(total);out.set(sig,0);
        let at=8;for(const c of chunks){out.set(c,at);at+=c.length}
        resolve(new Blob([out],{type:"image/apng"}));
      }catch(e){reject(e)}
    },"image/png");
  });
}

function canvasToIcoBlob(canvas){
  const w=Math.min(256,canvas.width), h=Math.min(256,canvas.height);
  const c=document.createElement("canvas");
  c.width=w;c.height=h;
  c.getContext("2d").drawImage(canvas,0,0,w,h);
  const rgba=c.getContext("2d").getImageData(0,0,w,h).data;

  // ICO containing one 32-bit BGRA PNG image.
  // PNG-in-ICO is widely supported and preserves transparency.
  return new Promise((resolve,reject)=>{
    c.toBlob(async png=>{
      if(!png){reject(new Error("Không tạo được PNG cho ICO."));return;}
      const bytes=new Uint8Array(await png.arrayBuffer());
      const header=new ArrayBuffer(22);
      const dv=new DataView(header);
      dv.setUint16(0,0,true);       // reserved
      dv.setUint16(2,1,true);       // icon
      dv.setUint16(4,1,true);       // count
      dv.setUint8(6,w===256?0:w);
      dv.setUint8(7,h===256?0:h);
      dv.setUint8(8,0);             // palette
      dv.setUint8(9,0);             // reserved
      dv.setUint16(10,1,true);      // color planes
      dv.setUint16(12,32,true);     // bpp
      dv.setUint32(14,bytes.length,true);
      dv.setUint32(18,22,true);
      resolve(new Blob([header,bytes],{type:"image/x-icon"}));
    },"image/png");
  });
}

function canvasToSvgBlob(canvas){
  // Raster embedded inside SVG. This makes the SVG valid and lossless
  // with respect to the raster pixels, while preserving transparency.
  const data=canvas.toDataURL("image/png");
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}" viewBox="0 0 ${canvas.width} ${canvas.height}"><image href="${data}" width="${canvas.width}" height="${canvas.height}"/></svg>`;
  return new Blob([svg],{type:"image/svg+xml"});
}

function canvasToTgaBlob(canvas){
  const w=canvas.width,h=canvas.height;
  const data=canvas.getContext("2d").getImageData(0,0,w,h).data;
  const header=new Uint8Array(18);
  header[2]=2; // uncompressed true-color
  header[12]=w&255; header[13]=(w>>8)&255;
  header[14]=h&255; header[15]=(h>>8)&255;
  header[16]=32; // RGBA
  header[17]=8;  // 8 alpha bits
  const pixels=new Uint8Array(w*h*4);
  let p=0;
  // TGA stores bottom-left origin. Write rows bottom-up.
  for(let y=h-1;y>=0;y--){
    for(let x=0;x<w;x++){
      const i=(y*w+x)*4;
      pixels[p++]=data[i+2]; // B
      pixels[p++]=data[i+1]; // G
      pixels[p++]=data[i];   // R
      pixels[p++]=data[i+3]; // A
    }
  }
  return new Blob([header,pixels],{type:"image/x-tga"});
}


function tokenizePNM(bytes){
  let i=0, tokens=[];
  while(i<bytes.length){
    while(i<bytes.length && (bytes[i]===32||bytes[i]===9||bytes[i]===10||bytes[i]===13)) i++;
    if(bytes[i]===35){ while(i<bytes.length && bytes[i]!==10)i++; continue; }
    if(i>=bytes.length)break;
    let st=i;
    while(i<bytes.length && bytes[i]>32 && bytes[i]!==35)i++;
    tokens.push(new TextDecoder().decode(bytes.slice(st,i)));
  }
  return tokens;
}

async function decodePNM(file){
  const bytes=new Uint8Array(await file.arrayBuffer());
  const tok=tokenizePNM(bytes);
  if(tok.length<3) throw new Error("PNM không hợp lệ.");
  const magic=tok[0];
  if(!/^P[1-6]$/.test(magic)) throw new Error("PNM magic không hợp lệ.");
  if(magic==="P6"||magic==="P5"||magic==="P4"){
    // Binary payload starts after the third/fourth header token.
    let pos=0, count=0;
    while(pos<bytes.length && count<3){
      while(pos<bytes.length && (bytes[pos]===32||bytes[pos]===9||bytes[pos]===10||bytes[pos]===13))pos++;
      if(bytes[pos]===35){while(pos<bytes.length&&bytes[pos]!==10)pos++;continue;}
      while(pos<bytes.length && bytes[pos]>32 && bytes[pos]!==35)pos++;
      count++;
    }
    while(pos<bytes.length && (bytes[pos]===32||bytes[pos]===9||bytes[pos]===10||bytes[pos]===13))pos++;
    const w=parseInt(tok[1]),h=parseInt(tok[2]);
    const max=magic==="P4"?1:parseInt(tok[3]);
    const canvas=document.createElement("canvas");canvas.width=w;canvas.height=h;
    const out=new Uint8ClampedArray(w*h*4);
    if(magic==="P6"){
      for(let i=0,j=0;i<w*h && pos+2<bytes.length;i++,j+=4){
        out[j]=bytes[pos++]*255/max;out[j+1]=bytes[pos++]*255/max;out[j+2]=bytes[pos++]*255/max;out[j+3]=255;
      }
    }else if(magic==="P5"){
      for(let i=0,j=0;i<w*h && pos<bytes.length;i++,j+=4){
        const v=bytes[pos++]*255/max;out[j]=out[j+1]=out[j+2]=v;out[j+3]=255;
      }
    }else{
      const row=Math.ceil(w/8);
      for(let y=0;y<h;y++)for(let x=0;x<w;x++){
        const bit=(bytes[pos+y*row+(x>>3)]>>(7-(x&7)))&1;
        const v=bit?0:255, j=(y*w+x)*4; out[j]=out[j+1]=out[j+2]=v;out[j+3]=255;
      }
    }
    canvas.getContext("2d").putImageData(new ImageData(out,w,h),0,0);
    return new Promise((res,rej)=>canvas.toBlob(b=>b?res(b):rej(new Error("PNM decode lỗi")),"image/png"));
  }
  throw new Error("PNM ASCII P1/P2/P3 hiện chưa bật.");
}

function canvasToPNMBlob(canvas,type){
  const w=canvas.width,h=canvas.height,data=canvas.getContext("2d").getImageData(0,0,w,h).data;
  let header="", body=[];
  if(type==="image/x-portable-pixmap"){
    header=`P6\n${w} ${h}\n255\n`;
    body=new Uint8Array(w*h*3);
    for(let i=0,j=0;i<w*h;i++,j+=3){body[j]=data[i*4];body[j+1]=data[i*4+1];body[j+2]=data[i*4+2];}
  }else if(type==="image/x-portable-graymap"){
    header=`P5\n${w} ${h}\n255\n`;
    body=new Uint8Array(w*h);
    for(let i=0;i<w*h;i++)body[i]=Math.round(.299*data[i*4]+.587*data[i*4+1]+.114*data[i*4+2]);
  }else{
    header=`P4\n${w} ${h}\n`;
    const row=Math.ceil(w/8); body=new Uint8Array(row*h);
    for(let y=0;y<h;y++)for(let x=0;x<w;x++){
      const i=(y*w+x)*4, v=(.299*data[i]+.587*data[i+1]+.114*data[i+2])<128;
      if(v) body[y*row+(x>>3)]|=1<<(7-(x&7));
    }
  }
  return new Blob([new TextEncoder().encode(header),body],{type});
}

function canvasToPAMBlob(canvas){
  const w=canvas.width,h=canvas.height,data=canvas.getContext("2d").getImageData(0,0,w,h).data;
  const header=`P7\nWIDTH ${w}\nHEIGHT ${h}\nDEPTH 4\nMAXVAL 255\nTUPLTYPE RGB_ALPHA\nENDHDR\n`;
  return new Blob([new TextEncoder().encode(header),data],{type:"image/x-portable-anymap"});
}

function canvasToQOIBlob(canvas){
  const w=canvas.width,h=canvas.height,px=canvas.getContext("2d").getImageData(0,0,w,h).data;
  const out=[]; const push32=n=>{out.push((n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255)};
  out.push(0x71,0x6f,0x69,0x66); push32(w);push32(h);out.push(4,0);
  const index=new Uint8Array(64), seen=new Uint8Array(64);
  let r=0,g=0,b=0,a=255;
  const hash=(r,g,b,a)=>((r*3+g*5+b*7+a*11)&63);
  let run=0;
  for(let i=0;i<w*h;i++){
    const j=i*4,nr=px[j],ng=px[j+1],nb=px[j+2],na=px[j+3],idx=hash(nr,ng,nb,na);
    if(nr===r&&ng===g&&nb===b&&na===a){run++;if(run===62||i===w*h-1){out.push(0xc0|(run-1));run=0;}continue;}
    if(run){out.push(0xc0|(run-1));run=0;}
    const base=idx*4;
    if(seen[idx]&&index[base]===nr&&index[base+1]===ng&&index[base+2]===nb&&index[base+3]===na){
      out.push(idx);
    }else{
      seen[idx]=1;index[base]=nr;index[base+1]=ng;index[base+2]=nb;index[base+3]=na;
      if(na===a){
        const dr=nr-r,dg=ng-g,db=nb-b;
        if(dr>-3&&dr<2&&dg>-3&&dg<2&&db>-3&&db<2) out.push(0x40|((dr+2)<<4)|((dg+2)<<2)|(db+2));
        else if(dg>-33&&dg<32&&dr-dg>-9&&dr-dg<8&&db-dg>-9&&db-dg<8)
          out.push(0x80|(dg+32),((dr-dg+8)<<4)|(db-dg+8));
        else out.push(0xfe,nr,ng,nb);
      }else out.push(0xff,nr,ng,nb,na);
    }
    r=nr;g=ng;b=nb;a=na;
  }
  out.push(0,0,0,0,0,0,0,1);
  return new Blob([new Uint8Array(out)],{type:"image/qoi"});
}


function canvasToPCXBlob(canvas){
  const w=canvas.width,h=canvas.height,data=canvas.getContext("2d").getImageData(0,0,w,h).data;
  const bytes=[];
  const header=new Uint8Array(128);
  header[0]=0x0A;header[1]=5;header[2]=1;header[3]=8;
  header[4]=w&255;header[5]=(w>>8)&255;header[6]=h&255;header[7]=(h>>8)&255;
  header[65]=1; // one color plane
  const bpl=(w+1)&~1;header[66]=bpl&255;header[67]=(bpl>>8)&255;
  header[68]=1;header[69]=0;
  for(let i=0;i<header.length;i++)bytes.push(header[i]);
  for(let y=0;y<h;y++){
    const row=[];
    for(let x=0;x<w;x++){
      const i=(y*w+x)*4;
      // Grayscale PCX, one 8-bit plane.
      row.push(Math.round(.299*data[i]+.587*data[i+1]+.114*data[i+2]));
    }
    if(row.length&1)row.push(0);
    for(let i=0;i<row.length;){
      const v=row[i];let run=1;
      while(i+run<row.length&&row[i+run]===v&&run<63)run++;
      if(run>1||(v&0xC0)===0xC0)bytes.push(0xC0|run,v);
      else bytes.push(v);
      i+=run;
    }
  }
  // PCX 256-color palette marker + grayscale palette.
  bytes.push(12);
  for(let i=0;i<256;i++)bytes.push(i,i,i);
  return new Blob([new Uint8Array(bytes)],{type:"image/vnd.zbrush.pcx"});
}

function canvasToDDSBlob(canvas){
  const w=canvas.width,h=canvas.height,data=canvas.getContext("2d").getImageData(0,0,w,h).data;
  const header=new Uint8Array(128);
  const dv=new DataView(header.buffer);
  const u32=(o,v)=>dv.setUint32(o,v,true);
  u32(0,0x20534444);u32(4,124);u32(8,0x00001007|0x00000008);u32(12,h);u32(16,w);
  u32(20,w*4);u32(24,0);u32(28,0);u32(76,32);u32(80,0x41); // RGB|RGBA
  u32(84,0x00000040); // DDPF_RGB
  u32(88,0x00ff0000);u32(92,0x0000ff00);u32(96,0x000000ff);u32(100,0xff000000);
  u32(108,0x1000); // texture
  const px=new Uint8Array(w*h*4);
  let p=0;
  for(let i=0;i<data.length;i+=4){px[p++]=data[i+2];px[p++]=data[i+1];px[p++]=data[i];px[p++]=data[i+3]}
  return new Blob([header,px],{type:"image/vnd-ms.dds"});
}

function canvasToHDRBlob(canvas){
  const w=canvas.width,h=canvas.height,data=canvas.getContext("2d").getImageData(0,0,w,h).data;
  const lines=[`#?RADIANCE`,`FORMAT=32-bit_rle_rgbe`,``,`-Y ${h} +X ${w}`,``];
  const out=[new TextEncoder().encode(lines.join("\n"))];
  const bytes=new Uint8Array(w*h*4);
  let p=0;
  for(let i=0;i<data.length;i+=4){
    const r=data[i]/255,g=data[i+1]/255,b=data[i+2]/255;
    const m=Math.max(r,g,b);
    if(m<1e-9){bytes[p++]=0;bytes[p++]=0;bytes[p++]=0;bytes[p++]=0;continue}
    const e=Math.ceil(Math.log2(m));
    const scale=256/Math.pow(2,e);
    bytes[p++]=Math.min(255,Math.round(r*scale));
    bytes[p++]=Math.min(255,Math.round(g*scale));
    bytes[p++]=Math.min(255,Math.round(b*scale));
    bytes[p++]=e+128;
  }
  out.push(bytes);
  return new Blob(out,{type:"image/vnd.radiance"});
}

function canvasToSGIBlob(canvas){
  const w=canvas.width,h=canvas.height,data=canvas.getContext("2d").getImageData(0,0,w,h).data;
  const header=new Uint8Array(512),dv=new DataView(header.buffer);
  const be16=(o,v)=>dv.setUint16(o,v,false),be32=(o,v)=>dv.setUint32(o,v,false);
  be16(0,474);header[2]=1;header[3]=2;be16(4,3);be16(6,w);be16(8,h);be16(10,4);
  be32(104,0);be32(108,1);be32(112,1);
  const pixels=new Uint8Array(w*h*4);
  let p=0;
  for(let y=h-1;y>=0;y--)for(let x=0;x<w;x++){
    const i=(y*w+x)*4;pixels[p++]=data[i];pixels[p++]=data[i+1];pixels[p++]=data[i+2];pixels[p++]=data[i+3];
  }
  return new Blob([header,pixels],{type:"image/x-sgi"});
}

function canvasToFITSBlob(canvas){
  const w=canvas.width,h=canvas.height,data=canvas.getContext("2d").getImageData(0,0,w,h).data;
  const cards=[
    "SIMPLE  =                    T",
    "BITPIX  =                    8",
    "NAXIS   =                    2",
    `NAXIS1  = ${String(w).padStart(20)}`,
    `NAXIS2  = ${String(h).padStart(20)}`,
    "END"
  ];
  let text=cards.map(x=>x.padEnd(80," ")).join("");
  text=text.padEnd(Math.ceil(text.length/2880)*2880," ");
  const out=new Uint8Array(text.length+w*h);
  out.set(new TextEncoder().encode(text));
  let p=text.length;
  for(let y=h-1;y>=0;y--)for(let x=0;x<w;x++){
    const i=(y*w+x)*4;out[p++]=Math.round(.299*data[i]+.587*data[i+1]+.114*data[i+2]);
  }
  const padded=new Uint8Array(Math.ceil(out.length/2880)*2880);padded.set(out);
  return new Blob([padded],{type:"application/fits"});
}

function canvasToMIFFBlob(canvas){
  // Minimal MIFF-like header with 8-bit RGB pixel data.
  // Kept intentionally simple and deterministic.
  const w=canvas.width,h=canvas.height,data=canvas.getContext("2d").getImageData(0,0,w,h).data;
  const header=`id=ImageMagick class=DirectClass colorspace=RGB matte=True columns=${w} rows=${h} depth=8\n`;
  const px=new Uint8Array(w*h*4);px.set(data);
  return new Blob([new TextEncoder().encode(header),px],{type:"image/x-miff"});
}

async function decodeSpecialImage(file){
  const name=file.name.toLowerCase();
  const type=(file.type||"").toLowerCase();

  // HEIC / HEIF -> PNG blob through libheif WASM wrapper.
  if(type.includes("heic")||type.includes("heif")||/\.(heic|heif)$/.test(name)){
    if(typeof heic2any!=="function")
      throw new Error("HEIC decoder chưa được tải. Hãy mở trang khi có Internet.");
    const out=await heic2any({blob:file,toType:"image/png",quality:1});
    return Array.isArray(out)?out[0]:out;
  }

  // Portable anymap family: PNM/PPM/PGM/PBM.
  if(/\.(ppm|pgm|pbm|pnm)$/.test(name) || type.includes("portable-")){
    return await decodePNM(file);
  }

  // The following formats are accepted as files and routed through a clear
  // message until a full decoder is added. This prevents silent corruption.
  if(/\.(pcx|dds|hdr|sgi|fits?|miff)$/.test(name)){
    throw new Error("Định dạng này hiện có encoder, nhưng decoder input chưa được bật.");
  }

  // TGA -> PNG using TGA.js.
  if(type==="image/x-tga"||type==="image/tga"||/\.tga$/.test(name)){
    return await decodeTGA(file);
  }

  // SVG is already directly loadable by the browser.
  if(type==="image/svg+xml"||/\.svg$/.test(name)){
    return await decodeSVG(file);
  }

  // TIFF -> PNG using UTIF.js.
  if(type==="image/tiff"||/\.(tif|tiff)$/.test(name)){
    if(typeof UTIF==="undefined")
      throw new Error("TIFF decoder chưa được tải.");
    const buf=await file.arrayBuffer();
    const imgs=UTIF.decode(buf);
    if(!imgs.length) throw new Error("TIFF không chứa frame ảnh hợp lệ.");
    UTIF.decodeImage(buf,imgs[0]);
    const rgba=UTIF.toRGBA8(imgs[0]);
    const canvas=document.createElement("canvas");
    canvas.width=imgs[0].width;canvas.height=imgs[0].height;
    canvas.getContext("2d").putImageData(
      new ImageData(new Uint8ClampedArray(rgba),canvas.width,canvas.height),0,0
    );
    return new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error("Không tạo được PNG")), "image/png"));
  }

  return file;
}

async function loadUniversalImage(file){
  const decoded=await decodeSpecialImage(file);
  return loadImage(URL.createObjectURL(decoded));
}

function canvasToBlob(canvas,mime,q){
 return new Promise((resolve,reject)=>{
   canvas.toBlob(b=>b?resolve(b):reject(new Error("Trình duyệt không hỗ trợ encoder "+mime)),mime,q);
 });
}

function bmpBlob(canvas){
 const w=canvas.width,h=canvas.height;
 const ctx=canvas.getContext("2d");
 const data=ctx.getImageData(0,0,w,h).data;
 const rowSize=Math.floor((24*w+31)/32)*4;
 const pixelSize=rowSize*h;
 const buffer=new ArrayBuffer(54+pixelSize);
 const dv=new DataView(buffer);
 function u16(o,v){dv.setUint16(o,v,true)}
 function u32(o,v){dv.setUint32(o,v,true)}
 u16(0,0x4D42);u32(2,54+pixelSize);u32(6,0);u32(10,54);
 u32(14,40);u32(18,w);dv.setInt32(22,-h,true);u16(26,1);u16(28,24);
 u32(30,0);u32(34,pixelSize);u32(38,2835);u32(42,2835);u32(46,0);u32(50,0);
 let p=54;
 const pad=rowSize-w*3;
 for(let y=0;y<h;y++){
   for(let x=0;x<w;x++){
     const i=((h-1-y)*w+x)*4;
     dv.setUint8(p++,data[i+2]);dv.setUint8(p++,data[i+1]);dv.setUint8(p++,data[i]);
   }
   for(let k=0;k<pad;k++)dv.setUint8(p++,0);
 }
 return new Blob([buffer],{type:"image/bmp"});
}

async function convertOne(i){
 const x=items[i],status=$(`#status-${i}`),prog=$(`#prog-${i}`);
 try{
   status.textContent="Đang đọc ảnh…";prog.style.width="20%";
   const img=await loadUniversalImage(x.file);
   const {w,h}=getDimensions(img);
   if(w<1||h<1)throw new Error("Kích thước không hợp lệ.");
   const canvas=document.createElement("canvas");
   canvas.width=w;canvas.height=h;
   const ctx=canvas.getContext("2d",{alpha:true});
   ctx.clearRect(0,0,w,h);

   // JPEG không hỗ trợ alpha: dùng nền trắng.
   if(format.value==="image/jpeg"){
     ctx.fillStyle="#ffffff";ctx.fillRect(0,0,w,h);
   }
   ctx.drawImage(img,0,0,w,h);
   prog.style.width="65%";

   let blob;
   if(format.value==="image/bmp"){
     blob=bmpBlob(canvas);
   }else if(format.value==="image/x-icon"){
     blob=await canvasToIcoBlob(canvas);
   }else if(format.value==="image/svg+xml"){
     blob=canvasToSvgBlob(canvas);
    }else if(format.value==="image/x-tga"){
     blob=canvasToTgaBlob(canvas);
   }else if(format.value==="image/x-portable-pixmap"||format.value==="image/x-portable-graymap"||format.value==="image/x-portable-bitmap"){
     blob=canvasToPNMBlob(canvas,format.value);
   }else if(format.value==="image/x-portable-anymap"){
     blob=canvasToPAMBlob(canvas);
   }else if(format.value==="image/qoi"){
     blob=canvasToQOIBlob(canvas);
   }else if(format.value==="image/vnd.zbrush.pcx"){
     blob=canvasToPCXBlob(canvas);
   }else if(format.value==="image/vnd-ms.dds"){
     blob=canvasToDDSBlob(canvas);
   }else if(format.value==="image/vnd.radiance"){
     blob=canvasToHDRBlob(canvas);
   }else if(format.value==="image/x-sgi"){
     blob=canvasToSGIBlob(canvas);
   }else if(format.value==="application/fits"){
     blob=canvasToFITSBlob(canvas);
   }else if(format.value==="image/x-miff"){
     blob=canvasToMIFFBlob(canvas);
   }else if(format.value==="image/gif"){
     blob=await canvasToGifBlob(canvas);
   }else if(format.value==="image/tiff"){
     blob=await canvasToTiffBlob(canvas);
   }else if(format.value==="image/apng"){
     blob=await canvasToApngBlob(canvas);
   }else{
     blob=await canvasToBlob(canvas,format.value,Math.max(0.01,Number(quality.value||92)/100));
   }
   x.result=blob;
   prog.style.width="100%";
   status.textContent=`Hoàn tất • ${fmtBytes(blob.size)} • ${extFromMime(format.value).toUpperCase()}`;
   $(`#dl-${i}`).disabled=false;
   outputs=items.filter(v=>v.result);
   downloadAllBtn.disabled=outputs.length===0;
 }catch(err){
   console.error(err);
   status.textContent="Lỗi: "+err.message;
   prog.style.width="0";
 }
}

async function convertAll(){
 if(!items.length)return;
 convertBtn.disabled=true;
 for(let i=0;i<items.length;i++)await convertOne(i);
 convertBtn.disabled=false;
}

function filenameFor(x){
 const base=x.file.name.replace(/\.[^.]+$/,"");
 return base+"."+extFromMime(format.value);
}

function downloadOne(i){
 const x=items[i];if(!x.result)return;
 const a=document.createElement("a");
 const url=URL.createObjectURL(x.result);
 a.href=url;a.download=filenameFor(x);a.click();
 setTimeout(()=>URL.revokeObjectURL(url),1500);
}

async function downloadAll(){
 for(let i=0;i<items.length;i++){
   if(items[i].result)downloadOne(i);
   await new Promise(r=>setTimeout(r,180));
 }
}

function removeItem(i){
 URL.revokeObjectURL(items[i].url);
 items.splice(i,1);render();
}

$("#convert").addEventListener("click",convertAll);
$("#convertSide").addEventListener("click",convertAll);
downloadAllBtn.addEventListener("click",downloadAll);
$("#clear").addEventListener("click",()=>{
 items.forEach(x=>URL.revokeObjectURL(x.url));items=[];outputs=[];render();
});
render();

(function(){
  const key="imageforge_cookie_consent";
  const banner=document.getElementById("cookieBanner");
  const accept=document.getElementById("cookieAccept");
  const decline=document.getElementById("cookieDecline");
  if(!banner||!accept||!decline)return;

  function setConsent(value){
    localStorage.setItem(key,value);
    banner.hidden=true;
  }

  if(!localStorage.getItem(key))banner.hidden=false;
  accept.addEventListener("click",()=>setConsent("accepted"));
  decline.addEventListener("click",()=>setConsent("declined"));
})();
