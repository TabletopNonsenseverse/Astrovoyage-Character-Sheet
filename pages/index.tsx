import Link from 'next/link';
import Layout from '../components/Layout';
import {useEffect,useState} from 'react';
import {listCharacters} from '../lib/storage';
import type {Character} from '../lib/types';
export default function Home(){const [chars,setChars]=useState<Character[]>([]);useEffect(()=>{listCharacters().then(setChars)},[]);return <Layout><div className="hero"><div className="eyebrow">ASTROVOYAGE // PERSONNEL TERMINAL</div><h1>Character Terminal</h1><p>Build, save, and resume Astrovoyage characters in the browser.</p><Link className="primary" href="/character/create">BEGIN CHARACTER CREATION</Link></div><div className="panel"><div className="panelHead"><h2>RESUME CHARACTER</h2><span>{chars.length} SAVED</span></div>{chars.length===0?<p className="muted">No saved characters.</p>:chars.map(c=><div className="resumeRow" key={c.id}><div><b>{c.name||'UNNAMED'}</b><span>{c.currentStamina}/{c.stamina} Stamina • {c.credits.toLocaleString()}Cr</span></div><Link className="secondary" href={`/character/${c.id}`}>RESUME →</Link></div>)}</div></Layout>}
