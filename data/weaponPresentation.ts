export type WeaponAction = {
  title: string
  range: string
  target: string
  check?: string
  tiers?: string[]
  effect?: string
}

export const WEAPON_ACTIONS: Record<string, WeaponAction[]> = {
  "Pistol, Auto": [
    { title: "Single Shot", range: "150m", target: "One creature or object", check: "2d10 + Weapon, Light Ranged (A)", tiers: ["≤ 11 — 2 physical damage", "12-16 — 4 physical damage", "≥ 17 — 7 physical damage"] },
    { title: "Burst", range: "150m", target: "One creature or object", check: "2d10 + Weapon, Light Ranged (A)", tiers: ["≤ 11 — 4 physical damage", "12-16 — 7 physical damage", "≥ 17 — 11 physical damage"], effect: "Uses three ammunition." },
    { title: "Suppress", range: "3m cube within 150m", target: "All creatures in the area", effect: "Any creature that enters the area or is in the area until the shooter takes a different action immediately takes 4 physical damage. Uses 20 ammunition." }
  ],
  "Submachine Gun (SMG)": [
    { title: "Single Shot", range: "200m", target: "One creature or object", check: "2d10 + Weapon, Heavy Ranged (A)", tiers: ["≤ 11 — 4 physical damage", "12-16 — 7 physical damage", "≥ 17 — 10 physical damage"] },
    { title: "Burst", range: "150m", target: "One creature or object", check: "2d10 + Weapon, Heavy Ranged (A)", tiers: ["≤ 11 — 7 physical damage", "12-16 — 11 physical damage", "≥ 17 — 17 physical damage"], effect: "Uses three ammunition." },
    { title: "Suppress", range: "3m cube within 150m", target: "All creatures in the area", effect: "Any creature that enters the area or is in the area until the shooter takes a different action immediately takes 7 physical damage. Uses 20 ammunition." }
  ],
  "Uzi": [
    { title: "Single Shot", range: "150m", target: "One creature or object", check: "2d10 + Weapon, Heavy Ranged (A)", tiers: ["≤ 11 — 2 physical damage", "12-16 — 4 physical damage", "≥ 17 — 7 physical damage"] },
    { title: "Burst", range: "100m", target: "One creature or object", check: "2d10 + Weapon, Heavy Ranged (A)", tiers: ["≤ 11 — 4 physical damage", "12-16 — 7 physical damage", "≥ 17 — 11 physical damage"], effect: "Uses three ammunition." },
    { title: "Suppress", range: "3m cube within 150m", target: "All creatures in the area", effect: "Any creature that enters the area or is in the area until the shooter takes a different action immediately takes 4 physical damage. Uses 20 ammunition." }
  ],
  "Bow, Precision": [
    { title: "Shot", range: "100m", target: "One creature or object", check: "2d10 + Weapon, Light Ranged (A)", tiers: ["≤ 11 — 3 physical damage", "12-16 — 5 physical damage", "≥ 17 — 18 physical damage"] }
  ],
  "Rifle, Sniper": [
    { title: "Shot", range: "5000m", target: "One creature or object", check: "2d10 + Weapon, Heavy Ranged (A)", tiers: ["≤ 11 — 11 physical damage", "12-16 — 14 physical damage", "≥ 17 — 35 physical damage"] }
  ],
  "Rifle, Sniper Laser": [
    { title: "Shot", range: "1000m", target: "One creature or object", check: "2d10 + Weapon, Heavy Ranged (A)", tiers: ["≤ 11 — 16 physical damage", "12-16 — 19 physical damage", "≥ 17 — 40 physical damage"] }
  ]
}
