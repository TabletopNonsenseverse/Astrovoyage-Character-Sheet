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

  const setStam = (value: number) => {
    save({
      ...c,
      currentStamina: Math.max(
        0,
        Math.min(c.stamina, value)
      ),
    })
  }

  const setLuck = (value: number) => {
    save({
      ...c,
      luck: Math.max(
        0,
        Math.min(6, value)
      ),
    })
  }

  const addEquipment = (name: string) => {
    const item = EQUIPMENT.find(
      (equipment) => equipment.name === name
    )

    if (!item) {
      return
    }

    /*
     * EquipmentEntry.cost is a number in the existing
     * character type. Some equipment entries in the
     * existing equipment data have cost === null.
     *
     * We do not invent a cost for those entries.
     */
    if (item.cost === null) {
      return
    }

    const equipment = [
      ...c.equipment,
      {
        id: crypto.randomUUID(),
        name: item.name,
        quantity: 1,
        cost: item.cost,
      },
    ]

    save({
      ...c,
      equipment,
    })
  }

  const increaseEquipment = (index: number) => {
    const equipment = c.equipment.map(
      (item, itemIndex) =>
        itemIndex === index
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
    const equipment = c.equipment.map(
      (item, itemIndex) =>
        itemIndex === index
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
      (_, itemIndex) => itemIndex !== index
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
            onChange={(event) =>
              setStam(
                Number(event.target.value)
              )
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
        ).map((tabName) => (
          <button
            key={tabName}
            className={
              tab === tabName
                ? 'activeTab'
                : ''
            }
            onClick={() =>
              setTab(tabName)
            }
          >
            {tabName.toUpperCase()}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="grid three">
          <section className="panel">
            <h2>CHARACTERISTICS</h2>

            {CHARACTERISTICS.map(
              (characteristic) => (
                <div
                  className="line"
                  key={characteristic}
                >
                  <span>
                    {characteristic}
                  </span>

                  <b>
                    {
                      c.characteristics[
                        characteristic
                      ]
                    }
                  </b>
                </div>
              )
            )}
          </section>

          <section className="panel">
            <h2>RESOURCES</h2>

            <label>
              CREDITS

              <input
                type="number"
                min={0}
                value={c.credits}
                onChange={(event) =>
                  save({
                    ...c,
                    credits: Math.max(
                      0,
                      Number(
                        event.target.value
                      ) || 0
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
                onChange={(event) =>
                  save({
                    ...c,
                    improvementPoints:
                      Math.max(
                        0,
                        Number(
                          event.target.value
                        ) || 0
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
                onChange={(event) =>
                  setCondition(
                    event.target.value
                  )
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
              No condition mechanic is
              added here. This field is
              only a personal record.
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

          {SKILLS.map((skill) => (
            <div
              className="line"
              key={skill}
            >
              <span>{skill}</span>

              <b>
                {c.skills[skill]}
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
              onChange={(event) => {
                const name =
                  event.target.value

                if (!name) {
                  return
                }

                addEquipment(name)

                event.currentTarget.value =
                  ''
              }}
            >
              <option value="">
                ADD EQUIPMENT...
              </option>

              {EQUIPMENT.map((item) => (
                <option
                  key={item.name}
                  value={item.name}
                  disabled={
                    item.cost === null
                  }
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
