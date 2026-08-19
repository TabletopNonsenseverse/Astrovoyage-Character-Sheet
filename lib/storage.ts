import localforage from 'localforage';
import type { Character } from './types';
import { supabase } from './supabase';

const key=(id:string)=>`astrovoyage.character.${id}`;

async function currentUser(){
  const {data}=await supabase.auth.getUser();
  return data.user;
}

export async function saveCharacter(c:Character){
  const user=await currentUser();
  if(!user){await localforage.setItem(key(c.id),{...c,updatedAt:new Date().toISOString()});return;}
  const {error}=await supabase.from('characters').upsert({user_id:user.id,id:c.id,data:c,updated_at:new Date().toISOString()},{onConflict:'user_id,id'});
  if(error) throw error;
  await localforage.setItem(key(c.id),{...c,updatedAt:new Date().toISOString()});
}

export async function loadCharacter(id:string){
  const user=await currentUser();
  if(user){
    const {data,error}=await supabase.from('characters').select('data').eq('user_id',user.id).eq('id',id).maybeSingle();
    if(error) throw error;
    if(data?.data){await localforage.setItem(key(id),data.data);return data.data as Character;}
  }
  return await localforage.getItem<Character>(key(id));
}

export async function listCharacters(){
  const user=await currentUser();
  if(!user){const out:Character[]=[];await localforage.iterate<Character,void>(v=>{if(v&&typeof v==='object'&&'id' in v)out.push(v)});return out;}
  const {data,error}=await supabase.from('characters').select('data,updated_at').eq('user_id',user.id).order('updated_at',{ascending:false});
  if(error) throw error;
  const chars=(data||[]).map(row=>row.data as Character);
  for(const c of chars) await localforage.setItem(key(c.id),c);
  return chars;
}

export async function deleteCharacter(id:string){
  const user=await currentUser();
  if(user){const {error}=await supabase.from('characters').delete().eq('user_id',user.id).eq('id',id);if(error)throw error;}
  await localforage.removeItem(key(id));
}
