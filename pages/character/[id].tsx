import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import type { Character } from '../../lib/types'
import { CHARACTERISTICS, SKILLS } from '../../lib/types'
import { loadCharacter, saveCharacter } from '../../lib/storage'
import { EQUIPMENT } from '../../data/equipment'

export default function Active() {
  const r = useRouter()
  const [c, setC] = useState<Character | null>(null)
  const [tab, setTab] = useState<'overview' | 'skills' | 'inventory'>('overview')
  const [condition, setCondition] = useState('')

  useEffect(() => {
    if (!r.isReady) return
    loadCharacter(String(r.query.id)).then(setC)
  }, [r.isReady, r.query.id])

  if (!c) return <Layout><div className="panel">LOADING CHARACTER...</div></Layout>

  const save = (next: Character) => { setC(next); void saveCharacter(next) }
  const setStam = (value: number) => save({ ...c, currentStamina: Math.max(0, Math.min(c.stamina, value)) })
  const setLuck = (value: number) => save({ ...c, luck: Math.max(0, Math.min(6, value)) })
  const setCharacteristic = (name: typeof CHARACTERISTICS[number], value: number) => save({ ...c, characteristics: { ...c.characteristics, [name]: value } })
  const setSkill = (name: typeof SKILLS[number], value: number) => save({ ...c, skills: { ...c.skills, [name]: Math.max(0, Math.min(5, value)) } })
  const addEquipment = (name: string) => { const item = EQUIPMENT.find((equipment) => equipment.name === name); if (!item || item.cost === null) return; save({ ...c, equipment: [...c.equipment, { id: crypto.randomUUID(), name: item.name, quantity: 1, cost: item.cost }] }) }
  const increaseEquipment = (index: number) => save({ ...c, equipment: c.equipment.map((item, i) => i === index ? { ...item, quantity: item.quantity + 1 } : item) })
  const decreaseEquipment = (index: number) => save({ ...c, equipment: c.equipment.map((item, i) => i === index ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item) })
  const removeEquipment = (index: number) => save({ ...c, equipment: c.equipment.filter((_, i) => i !== index) })

  const renderEquipmentDetails = (details: string, category: string) => {
    const parts = details.split(';').map((part) => part.trim()).filter(Boolean)
    const range = parts.find((part) => /^\d+m\b/i.test(part))
    const target = parts.find((part) => /^(target|one creature|one object|one creature or object)\b/i.test(part))
    const combat = parts.find((part) => /Weapon,|damage/i.test(part) && !/^[≤≥]?\s*\d+[-+]?\d*/.test(part))
    const magazine = parts.find((part) => /^magazine/i.test(part))
    const ammo = parts.find((part) => /Cr\/shot/i.test(part))
    const tierPattern = /^(≤\s*\d+|≥\s*\d+|\d+\s*[-–]\s*\d+)/
    const tierParts = parts.filter((part) => tierPattern.test(part))
    const hasTiers = tierParts.length >= 2
    const consumed = new Set<string>([range || '', target || '', combat || '', magazine || '', ammo || '', ...tierParts])
    const special = parts.filter((part) => !consumed.has(part))
    const weapon = category === 'Melee Weapons' || category === 'Ranged'

    return <div className="equipmentDetails">
      {range && <div className="equipmentMeta">📐 <strong>Range:</strong> {range}</div>}
      {weapon && <div className="equipmentMeta">🎯 <strong>Target:</strong> {target ? target.replace(/^target\s*:?\s*/i, '') : 'One creature or object'}</div>}
      {combat && <div className="equipmentRule"><strong>{combat}</strong></div>}
      {hasTiers && <ul className="equipmentTiers">{tierParts.map((part) => <li key={part}>{part}</li>)}</ul>}
      {special.length > 0 && <div className="equipmentRule"><strong>Special Effect:</strong> {special.join(' ')}</div>}
      {ammo && <div className="equipmentRule"><strong>Ammunition Cost:</strong> {ammo.replace(/^.*?([0-9]+Cr\/shot).*$/i, '$1')}</div>}
      {magazine && <div className="equipmentRule"><strong>Magazine:</strong> {magazine.replace(/^magazine\s*/i, '')}</div>}
    </div>
  }

  return <Layout>
    <div className="activeTop"><div><div className="eyebrow">ACTIVE PERSONNEL</div><h1>{c.name || 'UNNAMED'}</h1></div><span className="save">● AUTOSAVED</span></div>
    <div className="hud">
      <div><span>STAMINA</span><b>{c.currentStamina} / {c.stamina}</b><input type="range" min={0} max={c.stamina} value={c.currentStamina} onChange={(e) => setStam(Number(e.target.value))} /></div>
      <div><span>SPEED</span><b>{c.speed}m</b></div>
      <div><span>LUCK</span><b>{c.luck}/6</b><div><button onClick={() => setLuck(c.luck - 1)}>−</button><button onClick={() => setLuck(c.luck + 1)}>+</button></div></div>
      <div><span>IP</span><b>{c.improvementPoints}</b></div><div><span>CREDITS</span><b>{c.credits.toLocaleString()} Cr</b></div>
    </div>
    <div className="tabs">{(['overview', 'skills', 'inventory'] as const).map((tabName) => <button key={tabName} className={tab === tabName ? 'activeTab' : ''} onClick={() => setTab(tabName)}>{tabName.toUpperCase()}</button>)}</div>
    {tab === 'overview' && <div className="grid three">
      <section className="panel"><h2>CHARACTERISTICS</h2>{CHARACTERISTICS.map((characteristic) => <label className="editableStat" key={characteristic}>{characteristic}<input type="number" value={c.characteristics[characteristic]} onChange={(e) => setCharacteristic(characteristic, Number(e.target.value) || 0)} /></label>)}</section>
      <section className="panel"><h2>RESOURCES</h2><label>CREDITS<input type="number" min={0} value={c.credits} onChange={(e) => save({ ...c, credits: Math.max(0, Number(e.target.value) || 0) })} /></label><label>IMPROVEMENT POINTS<input type="number" min={0} value={c.improvementPoints} onChange={(e) => save({ ...c, improvementPoints: Math.max(0, Number(e.target.value) || 0) })} /></label><label>STAMINA<input type="number" min={0} max={c.stamina} value={c.currentStamina} onChange={(e) => setStam(Number(e.target.value) || 0)} /></label><label>LUCK<input type="number" min={0} max={6} value={c.luck} onChange={(e) => setLuck(Number(e.target.value) || 0)} /></label></section>
      <section className="panel"><h2>CONDITIONS / NOTES</h2><div className="row"><input value={condition} onChange={(e) => setCondition(e.target.value)} placeholder="Add note or condition" /><button onClick={() => setCondition('')}>CLEAR</button></div>{condition && <p>{condition}</p>}<p className="muted">Personal record only — no new condition mechanic is added.</p></section>
    </div>}
    {tab === 'skills' && <section className="panel"><h2>SKILLS</h2><div className="skillsEditable">{SKILLS.map((skill) => <label className="skillEdit" key={skill}><span>{skill}</span><input type="number" min={0} max={5} value={c.skills[skill]} onChange={(e) => setSkill(skill, Number(e.target.value) || 0)} /></label>)}</div></section>}
    {tab === 'inventory' && <section className="panel"><div className="inventory-head"><h2>INVENTORY</h2><select defaultValue="" onChange={(e) => { if (!e.target.value) return; addEquipment(e.target.value); e.currentTarget.value = '' }}><option value="">ADD EQUIPMENT...</option>{EQUIPMENT.map((item) => <option key={item.name} value={item.name} disabled={item.cost === null}>{item.name}</option>)}</select></div>
      <div className="equipmentGrid">{c.equipment.length === 0 ? <p className="muted">No equipment recorded.</p> : c.equipment.map((inventoryItem, index) => { const details = EQUIPMENT.find((item) => item.name === inventoryItem.name); if (!details) return null; return <article className="equipmentCard" key={inventoryItem.id}>
        <div className="equipmentCardHeader"><h3>{inventoryItem.name}</h3><button className="danger" onClick={() => removeEquipment(index)}>REMOVE</button></div><div className="equipmentDivider" />
        <div className="equipmentFields"><div><strong>Properties:</strong> {details.properties || '—'}</div><div><strong>Cost:</strong> {details.cost === null ? '—' : `${details.cost}Cr`}</div><div><strong>Rarity:</strong> {details.rarity === null ? '—' : details.rarity}</div><div><strong>Carry Capacity:</strong> {details.carry}</div></div>
        {renderEquipmentDetails(details.details, details.category)}
        <div className="equipmentQuantity"><span>QUANTITY</span><button onClick={() => decreaseEquipment(index)}>−</button><input type="number" min={1} value={inventoryItem.quantity} onChange={(e) => save({ ...c, equipment: c.equipment.map((item, i) => i === index ? { ...item, quantity: Math.max(1, Number(e.target.value) || 1) } : item) })} /><button onClick={() => increaseEquipment(index)}>+</button></div>
      </article>})}</div>
    </section>}
  </Layout>
}
