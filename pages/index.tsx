import Link from 'next/link';
import Layout from '../components/Layout';
import {useEffect,useState} from 'react';
import {listCharacters,deleteCharacter} from '../lib/storage';
import type {Character} from '../lib/types';
export default function Home(){
 const [chars,setChars]=useState<Character[]>([]);
 const refresh=()=>listCharacters().then(setChars);
 useEffect(()=>{void refresh()},[]);
 const remove=async(id:string)=>{if(!window.confirm('Delete this character permanently?'))return;await deleteCharacter(id);await refresh()};
 return <Layout><div className="hero"><div className="eyebrow">ASTROVOYAGE // PERSONNEL TERMINAL</div><h1>Character Terminal</h1><p>Build, save, and resume multiple Astrovoyage characters in the browser.</p><Link className="primary" href="/character/create">BEGIN CHARACTER CREATION</Link></div><div className="panel"><div className="panelHead"><h2>CHARACTERS</h2><span>{chars.length} SAVED</span></div>{chars.length===0?<p className="muted">No saved characters.</p>:chars.map(c=><div className="resumeRow" key={c.id}><div><b>{c.name||'UNNAMED'}</b><span>{c.currentStamina}/{c.stamina} Stamina • Luck {c.luck}/6 • {c.credits.toLocaleString()}Cr</span></div><div className="row"><Link className="secondary" href={`/character/${c.id}`}>OPEN →</Link><button className="danger" onClick={()=>remove(c.id)}>DELETE</button></div></div>)}</div></Layout>}
