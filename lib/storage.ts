import localforage from 'localforage';
import type { Character } from './types';

const key=(id:string)=>`astrovoyage.character.${id}`;
export async function saveCharacter(c:Character){await localforage.setItem(key(c.id),{...c,updatedAt:new Date().toISOString()});}
export async function loadCharacter(id:string){return await localforage.getItem<Character>(key(id));}
export async function listCharacters(){const out:Character[]=[];await localforage.iterate<Character,void>(v=>{if(v&&typeof v==='object'&&'id' in v)out.push(v)});return out;}
export async function deleteCharacter(id:string){await localforage.removeItem(key(id));}
