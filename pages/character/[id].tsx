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
  const [tab, setTab] = useState<
    'overview' | 'skills' | 'inventory'
  >('overview')

  const [condition, setCondition] = useState('')

  useEffect(() => {
    if (!r.isReady) return

    loadCharacter(String(r.query.id)).then(setC)
  }, [r.isReady, r.query.id])

  if (!c) {
    return (
      <Layout>
        <div className="panel">
          LOADING CHARACTER...
        </div>
      </Layout>
    )
  }

  const save = (next: Character) => {
    setC(next)
    void saveCharacter(next)
  }

  const setStam = (v: number) => {
    save({
      ...c,
      currentStamina: Math.max(
        0,
        Math.min(c.stamina, v)
      ),
    })
  }

  const setLuck = (v: number) => {
    save({
      ...c,
      luck: Math.max(
        0,
        Math.min(6, v)
      ),
    })
  }

  const addEquipment = (name: string) => {
    const item = EQUIPMENT.find(
      (x) => x.name === name
    )

    if (!item) return

    const equipment = [
      ...c.equipment,
      {
        id: crypto.randomUUID(),
        name: item.name,
        quantity: 1,
      },
    ]

    save({
      ...c,
      equipment,
    })
  }

  const increaseEquipment = (index: number) => {
    const equipment = c.equipment.map((item, i) =>
      i === index
        ? {
            ...item,
            quantity: item.quantity + 1,
          }
        : item
    )

    save({
      ...c,
      equipment,
    })
  }

  const decreaseEquipment = (index: number) => {
    const equipment = c.equipment.map((item, i) =>
      i === index
        ? {
            ...item,
            quantity: Math.max(
              1,
              item.quantity - 1
            ),
          }
        : item
    )

    save({
      ...c,
      equipment,
    })
  }

  const removeEquipment = (index: number) => {
    const equipment = c.equipment.filter(
      (_, i) => i !== index
    )

    save({
      ...c,
      equipment,
    })
  }

  return (
    <Layout>
      <div className="activeTop">
        <div>
          <div className="eyebrow">
            ACTIVE PERSONNEL
          </div>

          <h1>
            {c.name || 'UNNAMED'}
          </h1>
        </div>

        <span className="save">
          ● AUTOSAVED
        </span>
      </div>

      <div className="hud">
        <div>
          <span>STAMINA</span>

          <b>
            {c.currentStamina} / {c.stamina}
          </b>

          <input
            type="range"
            min={0}
            max={c.stamina}
            value={c.currentStamina}
            onChange={(e) =>
              setStam(Number(e.target.value))
            }
          />
        </div>

        <div>
          <span>SPEED</span>
          <b>{c.speed}m</b>
        </div>

        <div>
          <span>LUCK</span>

          <b>{c.luck}/6</b>

          <div>
            <button
              onClick={() =>
                setLuck(c.luck - 1)
              }
            >
              −
            </button>

            <button
              onClick={() =>
                setLuck(c.luck + 1)
              }
            >
              +
            </button>
          </div>
        </div>

        <div>
          <span>IP</span>
          <b>{c.improvementPoints}</b>
        </div>

        <div>
          <span>CREDITS</span>
          <b>
            {c.credits.toLocaleString()} Cr
          </b>
        </div>
      </div>

      <div className="tabs">
        {(
          ['overview', 'skills', 'inventory'] as const
        ).map((t) => (
          <button
            key={t}
            className={
              tab === t
                ? 'activeTab'
                : ''
            }
            onClick={() => setTab(t)}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="grid three">
          <section className="panel">
            <h2>CHARACTERISTICS</h2>

            {CHARACTERISTICS.map((k) => (
              <div
                className="line"
                key={k}
              >
                <span>{k}</span>

                <b>
                  {c.characteristics[k]}
                </b>
              </div>
            ))}
          </section>

          <section className="panel">
            <h2>RESOURCES</h2>

            <label>
              CREDITS

              <input
                type="number"
                min={0}
                value={c.credits}
                onChange={(e) =>
                  save({
                    ...c,
                    credits: Math.max(
                      0,
                      Number(e.target.value) || 0
                    ),
                  })
                }
              />
            </label>

            <label>
              IMPROVEMENT POINTS

              <input
                type="number"
                min={0}
                value={c.improvementPoints}
                onChange={(e) =>
                  save({
                    ...c,
                    improvementPoints: Math.max(
                      0,
                      Number(e.target.value) || 0
                    ),
                  })
                }
              />
            </label>
          </section>

          <section className="panel">
            <h2>
              CONDITIONS / NOTES
            </h2>

            <div className="row">
              <input
                value={condition}
                onChange={(e) =>
                  setCondition(e.target.value)
                }
                placeholder="Add note or condition"
              />

              <button
                onClick={() =>
                  setCondition('')
                }
              >
                CLEAR
              </button>
            </div>

            <p className="muted">
              No condition mechanic is added here.
              This field is only a personal record.
            </p>

            {condition && (
              <p>{condition}</p>
            )}
          </section>
        </div>
      )}

      {tab === 'skills' && (
        <section className="panel">
          <h2>SKILLS</h2>

          {SKILLS.map((s) => (
            <div
              className="line"
              key={s}
            >
              <span>{s}</span>

              <b>
                {c.skills[s]}
              </b>
            </div>
          ))}
        </section>
      )}

      {tab === 'inventory' && (
        <section className="panel">
          <div className="inventory-head">
            <h2>INVENTORY</h2>

            <select
              defaultValue=""
              onChange={(e) => {
                if (!e.target.value) return

                addEquipment(
                  e.target.value
                )

                e.currentTarget.value = ''
              }}
            >
              <option value="">
                ADD EQUIPMENT...
              </option>

              {EQUIPMENT.map((item) => (
                <option
                  key={item.name}
                  value={item.name}
                >
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {c.equipment.length === 0 ? (
            <p className="muted">
              No equipment recorded.
            </p>
          ) : (
            c.equipment.map(
              (inventoryItem, index) => {
                const details =
                  EQUIPMENT.find(
                    (item) =>
                      item.name ===
                      inventoryItem.name
                  )

                return (
                  <div
                    key={inventoryItem.id}
                  >
                    <div className="inventory-row">
                      <span>
                        {inventoryItem.name} ×{' '}
                        {inventoryItem.quantity}
                      </span>

                      <div>
                        <button
                          onClick={() =>
                            increaseEquipment(
                              index
                            )
                          }
                        >
                          +
                        </button>

                        <button
                          onClick={() =>
                            decreaseEquipment(
                              index
                            )
                          }
                        >
                          −
                        </button>

                        <button
                          onClick={() =>
                            removeEquipment(
                              index
                            )
                          }
                        >
                          REMOVE
                        </button>
                      </div>
                    </div>

                    {details && (
                      <div>
                        {Object.entries(
                          details
                        ).map(
                          ([key, value]) => {
                            if (
                              key === 'name'
                            ) {
                              return null
                            }

                            return (
                              <div
                                className="line"
                                key={key}
                              >
                                <span>
                                  {key}
                                </span>

                                <span>
                                  {typeof value ===
                                  'object'
                                    ? JSON.stringify(
                                        value
                                      )
                                    : String(
                                        value
                                      )}
                                </span>
                              </div>
                            )
                          }
                        )}
                      </div>
                    )}
                  </div>
                )
              }
            )
          )}
        </section>
      )}
    </Layout>
  )
}
