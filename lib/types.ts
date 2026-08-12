export const CHARACTERISTICS = ["Agility","Hardiness","Charisma","Experience","Intelligence"] as const;
export type Characteristic = typeof CHARACTERISTICS[number];

export const SKILLS = [
"Accounting","Animal Handling","Anthropology","Athletics","Biology","Bluff","Bureaucracy","Carouse","Chemistry","Computers","Culture","Cybernetics","Drive","Education","Electronics","Engineering","First Aid","Forgery","Gamble","Gunner","Hide","Interrogate","Intimidate","Investigate","Leadership","Lock Pick","Mechanic","Medicine","Perceive","Perform","Persuade","Physics","Pilot","Reflex","Religion","Research","Ride Mount","Sense Motive","Sleight of Hand","Streetwise","Survival","Trade","Weapon, Explosives","Weapon, Heavy Melee","Weapon, Heavy Ranged","Weapon, Light Melee","Weapon, Light Ranged","Weapon, Unarmed"
] as const;
export type SkillName = typeof SKILLS[number];

export type EquipmentEntry = { id:string; name:string; quantity:number; cost:number };

export type Character = {
  id:string;
  name:string;
  characteristics:Record<Characteristic,number>;
  skills:Record<SkillName,number>;
  stamina:number;
  currentStamina:number;
  speed:number;
  luck:number;
  improvementPoints:number;
  credits:number;
  equipmentCredits:number;
  equipment:EquipmentEntry[];
  createdAt:string;
  updatedAt:string;
};
