import { CHARACTERISTICS, SKILLS, type Characteristic, type SkillName, type Character } from './types';

export function blankCharacteristics(): Record<Characteristic, number> {
  return Object.fromEntries(CHARACTERISTICS.map(c => [c, 0])) as Record<Characteristic, number>;
}
export function blankSkills(): Record<SkillName, number> {
  return Object.fromEntries(SKILLS.map(s => [s, 0])) as Record<SkillName, number>;
}
export function characteristicTotal(c: Record<Characteristic, number>) {
  return CHARACTERISTICS.reduce((sum, k) => sum + c[k], 0);
}
export function derived(c: Record<Characteristic, number>) {
  return { stamina: 8 + c.Hardiness, speed: 5 + c.Agility };
}
export function newCharacter(name=''): Character {
  const now = new Date().toISOString();
  const characteristics = blankCharacteristics();
  const d = derived(characteristics);
  return {id:crypto.randomUUID(),name,characteristics,skills:blankSkills(),stamina:d.stamina,currentStamina:d.stamina,speed:d.speed,luck:1,improvementPoints:0,credits:0,equipmentCredits:2000,equipment:[],conditions:{},portrait:'',createdAt:now,updatedAt:now}
}
export function recalc(c: Character): Character {
  const d = derived(c.characteristics);
  return {...c,stamina:d.stamina,currentStamina:Math.min(c.currentStamina,d.stamina),speed:d.speed,updatedAt:new Date().toISOString()};
}
export const characteristicCosts = {"0-1":25,"1-2":50} as const;
export const skillCosts = {"0-1":10,"1-2":20,"2-3":30,"3-4":40,"4-5":50} as const;
export function creationSkillRequirementOk(c: Character): boolean {
  const vals = Object.values(c.skills);
  const at2 = vals.filter(v=>v===2).length;
  const at3 = vals.filter(v=>v===3).length;
  const at1 = vals.filter(v=>v===1).length;
  const extra = Math.max(0, 6 - characteristicTotal(c.characteristics));
  // New rule: require exactly five skills at 2, no skills at 1, and exactly `extra` skills at 3.
  return at2 === 5 && at1 === 0 && at3 === extra && vals.every(v=>v>=0 && v<=5);
}
