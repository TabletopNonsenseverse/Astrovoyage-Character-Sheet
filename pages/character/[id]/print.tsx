import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import type { Character } from '../../../lib/types'
import { CHARACTERISTICS, SKILLS } from '../../../lib/types'
import { loadCharacter } from '../../../lib/storage'

const CONDITIONS=['Bleeding','Blinded','Burning','Dazed','Deafened','Frightened','Grappled','Prone','Restrained','Stunned','Unconscious','Wounded']

export default function PrintCharacter(){
 const r=useRouter();const[c,setC]=useState<Character|null>(null)
 useEffect(()=>{if(r.isReady)loadCharacter(String(r.query.id)).then(setC)},[r.isReady,r.query.id])
 useEffect(()=>{if(c){const t=window.setTimeout(()=>window.print(),500);return()=>window.clearTimeout(t)}},[c])
 if(!c)return <main className="sheet">LOADING CHARACTER...</main>
 return <main className="sheet">
  <style jsx global>{`*{box-sizing:border-box}body{margin:0;background:#fff;color:#111;font-family:Arial,sans-serif}.sheet{max-width:1000px;margin:0 auto;padding:28px}.top{display:flex;justify-content:space-between;gap:24px;border-bottom:3px solid #111;padding-bottom:14px}.name{font-size:30px;font-weight:800}.eyebrow{font-size:10px;letter-spacing:2px;color:#555}.portrait{width:110px;height:110px;object-fit:cover;border:1px solid #555}.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:14px 0}.stat{border:1px solid #aaa;padding:10px}.stat b{display:block;font-size:22px}.chars{display:grid;grid-template-columns:repeat(5,1fr);border:1px solid #aaa}.char{padding:9px;text-align:center;border-right:1px solid #aaa}.char:last-child{border:0}.char b{display:block;font-size:20px;margin-top:3px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:14px}.panel{border:1px solid #aaa;padding:12px}.panel h2{font-size:13px;letter-spacing:1px;margin:0 0 9px}.item{padding:6px 0;border-bottom:1px solid #ddd}.skills{columns:4;column-gap:18px}.skill{display:flex;justify-content:space-between;padding:3px 0;break-inside:avoid}.conditions{display:grid;grid-template-columns:1fr 1fr}.condition{padding:4px 0}.muted{color:#666;font-size:11px}.printButton{position:fixed;right:20px;top:20px;padding:10px 16px}@media print{.printButton{display:none}.sheet{padding:10mm}}`}</style>
  <button className="printButton" onClick={()=>window.print()}>PRINT / SAVE AS PDF</button>
  <div className="top"><div><div className="eyebrow">ASTROVOYAGE // CHARACTER RECORD</div><div className="name">{c.name||'UNNAMED'}</div><div className="muted">ID: {c.id}</div></div>{c.portrait&&<img className="portrait" src={c.portrait} alt="Character portrait"/>}</div>
  <div className="stats"><div className="stat"><div>STAMINA</div><b>{c.currentStamina} / {c.stamina}</b></div><div className="stat"><div>LUCK</div><b>{c.luck} / 6</b></div><div className="stat"><div>ARMOUR</div><b>{c.armourValue??0}</b><span>Physical {c.thresholdPhysical??0} · Energy {c.thresholdEnergy??0}</span></div><div className="stat"><div>SPEED</div><b>{c.speed}m</b></div></div>
  <div className="chars">{CHARACTERISTICS.map(x=><div className="char" key={x}>{x.toUpperCase()}<b>{c.characteristics[x]}</b></div>)}</div>
  <div className="grid"><section className="panel"><h2>CONDITIONS</h2><div className="conditions">{CONDITIONS.map(x=><div className="condition" key={x}>☐ {x}</div>)}</div></section><section className="panel"><h2>EQUIPMENT</h2>{c.equipment.length?c.equipment.map(e=><div className="item" key={e.id}><b>{e.name}</b> × {e.quantity}<br/><span className="muted">{e.location==='storage'?'Storage':'Equipped'}{e.currentMagazine!==undefined?` · Magazine ${e.currentMagazine}`:''}</span></div>):<span className="muted">No equipment.</span>}</section></div>
  <section className="panel" style={{marginTop:14}}><h2>SKILLS</h2><div className="skills">{SKILLS.map(s=><div className="skill" key={s}><span>{s}</span><b>{c.skills[s]}</b></div>)}</div></section>
 </main>
}
