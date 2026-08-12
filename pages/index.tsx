import Link from 'next/link';
import Layout from '../components/Layout';
import {useEffect,useState} from 'react';
import {listCharacters,deleteCharacter} from '../lib/storage';
import type {Character} from '../lib/types';
import CharacterTransfer from '../components/CharacterTransfer';
export default function Home(){
 const [chars,setChars]=useState<Character[]>([]);
 const refresh=()=>listCharacters().then(setChars);
 useEffect(()=>{void refresh()},[]);
 const remove=async(id:string)=>{if(!window.confirm('Delete this character permanently?'))return;await deleteCharacter(id);await refresh()};
 return <Layout><div className="hero"><div className="eyebrow">ASTROVOYAGE // PERSONNEL TERMINAL</div><h1>Character Terminal</h1><p>Build, save, and resume multiple Astrovoyage characters in the browser.</p><Link className="primary" href="/character/create">BEGIN CHARACTER CREATION</Link></div><div className="panel transfer"><div><div className="panelHead"><h2>TRANSFER CHARACTERS</h2></div><p className="muted">Characters are saved in this browser. Export JSON to move them to another device, or export a printable PDF.</p></div><CharacterTransfer characters={chars} onImported={refresh}/></div><div className="panel"><div className="panelHead"><h2>CHARACTERS</h2><span>{chars.length} SAVED</span></div>{chars.length===0?<p className="muted">No saved characters.</p>:chars.map(c=><div className="resumeRow" key={c.id}><div><b>{c.name||'UNNAMED'}</b><span>{c.currentStamina}/{c.stamina} Stamina • Luck {c.luck}/6 • {c.credits.toLocaleString()}Cr</span></div><div className="row"><CharacterTransfer character={c}/><Link className="secondary" href={`/character/${c.id}`}>OPEN →</Link><button className="danger" onClick={()=>remove(c.id)}>DELETE</button></div></div>)}</div><style jsx>{`.transfer{display:flex;justify-content:space-between;align-items:center;gap:18px;margin-bottom:18px}.resumeRow .row{align-items:center;flex-wrap:wrap}.resumeRow .row :global(.transferPanel){display:flex;gap:6px}.resumeRow .row :global(.transferPanel) button:nth-child(3),.resumeRow .row :global(.transferPanel) button:nth-child(4){display:none}@media(max-width:760px){.transfer{align-items:flex-start;flex-direction:column}}`}</style></Layout>}
