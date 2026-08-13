import { useRef, useState } from 'react'
import type { Character } from '../lib/types'
import { saveCharacter } from '../lib/storage'
import { CHARACTERISTICS, SKILLS } from '../lib/types'

const CONDITIONS=['Bleeding','Blinded','Burning','Dazed','Deafened','Frightened','Grappled','Prone','Restrained','Stunned','Unconscious','Wounded']
function download(name:string,data:Blob|string,type='application/octet-stream'){const blob=data instanceof Blob?data:new Blob([data],{type});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function safeName(name:string){return(name||'unnamed-character').replace(/[^a-z0-9_-]+/gi,'_')}

async function exportPdf(c:Character){
 const {PDFDocument,StandardFonts,rgb}=await import('pdf-lib');
 const pdf=await PDFDocument.create();
 const regular=await pdf.embedFont(StandardFonts.Helvetica);
 const bold=await pdf.embedFont(StandardFonts.HelveticaBold);
 const form=pdf.getForm();
 const W=595.28,H=841.89,M=32;
 const dark=rgb(.05,.09,.13),blue=rgb(.09,.35,.55),muted=rgb(.32,.4,.46),line=rgb(.72,.78,.82),fieldBg=rgb(.96,.98,1);
 let n=0;
 let page=pdf.addPage([W,H]);
 const pdfValue=(value:unknown)=>String(value??'').replace(/[^\x20-\x7E]/g,' ');
 const tf=(name:string,value:unknown,x:number,y:number,w:number,h:number,size=9)=>{
   const f=form.createTextField(`field_${n++}_${name.replace(/[^a-z0-9]/gi,'_')}`);
   f.setText(pdfValue(value));
   f.addToPage(page,{x,y,width:w,height:h,borderWidth:0,backgroundColor:fieldBg});
   f.setFontSize(size);
   return f;
 };
 const label=(s:string,x:number,y:number,size=8)=>page.drawText(pdfValue(s),{x,y,size,font:regular,color:muted});
 const head=(s:string,x:number,y:number,size=11)=>page.drawText(pdfValue(s),{x,y,size,font:bold,color:dark});
 page.drawText('ASTROVOYAGE CHARACTER SHEET',{x:M,y:H-38,size:18,font:bold,color:dark});
 page.drawText('CHARACTER RECORD',{x:M,y:H-53,size:7,font:bold,color:muted});
 page.drawLine({start:{x:M,y:H-62},end:{x:W-M,y:H-62},thickness:3,color:blue});
 let y=H-92;
 label('NAME',M,y+20);tf('name',c.name||'UNNAMED',M,y-2,260,22,12);
 label('ID',330,y+20);tf('id',c.id,330,y-2,233,22,8);y-=48;
 const sw=(W-2*M-18)/4;
 [['STAMINA',`${c.currentStamina} / ${c.stamina}`],['LUCK',`${c.luck} / 6`],['ARMOUR',String(c.armourValue??0)],['SPEED',`${c.speed}m`]].forEach((s,i)=>{const x=M+i*(sw+6);label(s[0],x,y+28);tf(s[0],s[1],x,y,sw,24,11)});y-=38;
 head('DAMAGE THRESHOLD',M,y+25);
 label('PHYSICAL',M,y+7);label('ENERGY',145,y+7);
 tf('thresholdPhysical',c.thresholdPhysical??0,M,y-16,110,22,10);
 tf('thresholdEnergy',c.thresholdEnergy??0,145,y-16,110,22,10);
 label('CREDITS',290,y+7);tf('credits',c.credits,290,y-16,110,22,10);
 label('IMPROVEMENT POINTS',410,y+7);tf('improvementPoints',c.improvementPoints,410,y-16,123,22,10);y-=58;
 head('CHARACTERISTICS',M,y+10);const cw=(W-2*M)/5;
 CHARACTERISTICS.forEach((s,i)=>{const x=M+i*cw;label(s.toUpperCase(),x,y-10);tf(`characteristic_${s}`,c.characteristics[s],x,y-38,cw-5,22,11)});y-=70;
 head('CONDITIONS',M,y);const cy=y-18;
 CONDITIONS.forEach((cond,i)=>{const col=i%3,row=Math.floor(i/3),x=M+col*178,yy=cy-row*22;const cb=form.createCheckBox(`condition_${n++}_${cond.toLowerCase()}`);cb.addToPage(page,{x,y:yy-2,width:11,height:11,borderWidth:1,borderColor:line});page.drawText(cond,{x:x+16,y:yy,size:8,font:regular,color:dark})});
 y=cy-3*22-18;
 head('SKILLS',M,y);
 const sortedSkills=[...SKILLS].sort((a,b)=>a.localeCompare(b));
 const skillCols=4;
 const skillRows=Math.ceil(sortedSkills.length/skillCols);
 const skillColW=(W-2*M-18*(skillCols-1))/skillCols;
 const skillStartY=y-18;
 const skillRowH=18;
 sortedSkills.forEach((s,i)=>{const col=Math.floor(i/skillRows),row=i%skillRows,x=M+col*(skillColW+18),yy=skillStartY-row*skillRowH;page.drawText(pdfValue(s),{x,y:yy+4,size:7,font:regular,color:dark});tf(`skill_${s}`,c.skills[s],x+skillColW-32,yy,32,14,8)});

 page=pdf.addPage([W,H]);
 page.drawText('ASTROVOYAGE CHARACTER SHEET',{x:M,y:H-38,size:18,font:bold,color:dark});
 page.drawText('INVENTORY // PAGE 02',{x:M,y:H-53,size:7,font:bold,color:muted});
 page.drawLine({start:{x:M,y:H-62},end:{x:W-M,y:H-62},thickness:3,color:blue});
 label('CHARACTER',M,H-90);tf('inventoryCharacter',c.name||'UNNAMED',M,H-112,260,20,10);
 label('INVENTORY',M,H-145);let iy=H-166;
 const equipment=Array.isArray(c.equipment)?c.equipment:[];
 equipment.forEach((item,i)=>{
   if(iy<75){page=pdf.addPage([W,H]);iy=H-55;page.drawText('ASTROVOYAGE CHARACTER SHEET — INVENTORY',{x:M,y:H-30,size:10,font:bold,color:dark})}
   page.drawRectangle({x:M,y:iy-2,width:W-2*M,height:42,borderWidth:1,borderColor:line,color:rgb(.97,.985,1)});
   tf(`item_${i}_name`,item.name,M+7,iy+17,210,17,8);
   tf(`item_${i}_quantity`,item.quantity??1,M+225,iy+17,50,17,8);
   tf(`item_${i}_location`,item.location==='storage'?'Storage':'Equipped',M+281,iy+17,90,17,8);
   tf(`item_${i}_magazine`,item.currentMagazine===undefined?'':item.currentMagazine,M+377,iy+17,65,17,8);
   tf(`item_${i}_details`,[item.properties,item.details].filter(Boolean).join(' · '),M+7,iy-1,435,16,7);
   iy-=50;
 });
 if(!equipment.length)page.drawText('No equipment recorded.',{x:M,y:iy,size:9,font:regular,color:muted});
 const bytes=await pdf.save({useObjectStreams:false});
 download(`${safeName(c.name)}.pdf`,new Blob([bytes],{type:'application/pdf'}));
}

type Props={character?:Character;characters?:Character[];onImported?:()=>void}
export default function CharacterTransfer({character,characters=[],onImported}:Props){const input=useRef<HTMLInputElement>(null);const[exporting,setExporting]=useState(false);const exportJson=(c:Character)=>download(`${safeName(c.name)}.json`,JSON.stringify(c,null,2),'application/json');const exportAll=()=>download('astrovoyage-characters.json',JSON.stringify({format:'astrovoyage-character-export',version:1,characters},null,2),'application/json');const doPdf=async(c:Character)=>{if(exporting)return;setExporting(true);try{await exportPdf(c)}catch(e){console.error('Astrovoyage PDF export failed:',e);window.alert('PDF export failed. Please try again.')}finally{setExporting(false)}};const importJson=async(file:File)=>{try{const parsed=JSON.parse(await file.text());const incoming:Character[]=Array.isArray(parsed)?parsed:Array.isArray(parsed?.characters)?parsed.characters:parsed?.id?[parsed]:[];if(!incoming.length||incoming.some(c=>!c||typeof c.id!=='string'||!Array.isArray(c.equipment)))throw new Error('Invalid character export');for(const c of incoming)await saveCharacter(c);onImported?.();window.alert(`${incoming.length} character${incoming.length===1?'':'s'} imported successfully.`)}catch{window.alert('That file is not a valid Astrovoyage character export.')}finally{if(input.current)input.current.value=''}};return <div className="transferPanel"><style jsx>{`.transferPanel{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.transferPanel button{padding:8px 12px;background:#10283a;border:1px solid #39739a;color:#dff4ff;font:9px 'Orbitron',sans-serif;letter-spacing:1px;cursor:pointer}.transferPanel button:hover{background:#174562}.transferPanel input{display:none}`}</style>{character&&<button onClick={()=>exportJson(character)}>EXPORT JSON</button>}{character&&<button disabled={exporting} onClick={()=>void doPdf(character)}>{exporting?'CREATING PDF…':'EXPORT PDF'}</button>}{characters.length>0&&<button onClick={exportAll}>EXPORT ALL JSON</button>}<button onClick={()=>input.current?.click()}>IMPORT JSON</button><input ref={input} type="file" accept="application/json,.json" onChange={e=>e.target.files?.[0]&&void importJson(e.target.files[0])}/></div>}
