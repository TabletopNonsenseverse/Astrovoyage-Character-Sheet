import { useRef } from 'react'
import type { Character } from '../lib/types'
import { saveCharacter } from '../lib/storage'

type Props = { character?: Character; characters?: Character[]; onImported?: () => void }

function download(name: string, text: string, type: string) {
  const blob = new Blob([text], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export default function CharacterTransfer({ character, characters = [], onImported }: Props) {
  const input = useRef<HTMLInputElement>(null)
  const exportJson = (c: Character) => download(`${(c.name || 'unnamed-character').replace(/[^a-z0-9_-]+/gi, '_')}.json`, JSON.stringify(c, null, 2), 'application/json')
  const exportAll = () => download('astrovoyage-characters.json', JSON.stringify({ format: 'astrovoyage-character-export', version: 1, characters }, null, 2), 'application/json')
  const importJson = async (file: File) => {
    try {
      const parsed = JSON.parse(await file.text())
      const incoming: Character[] = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.characters) ? parsed.characters : parsed?.id ? [parsed] : []
      if (!incoming.length || incoming.some(c => !c || typeof c.id !== 'string' || !Array.isArray(c.equipment))) throw new Error('Invalid character export')
      for (const c of incoming) await saveCharacter(c)
      onImported?.()
      window.alert(`${incoming.length} character${incoming.length === 1 ? '' : 's'} imported successfully.`)
    } catch {
      window.alert('That file is not a valid Astrovoyage character export.')
    } finally {
      if (input.current) input.current.value = ''
    }
  }

  return <div className="transferPanel">
    <style jsx>{`.transferPanel{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.transferPanel button{padding:8px 12px;background:#10283a;border:1px solid #39739a;color:#dff4ff;font:9px 'Orbitron',sans-serif;letter-spacing:1px;cursor:pointer}.transferPanel button:hover{background:#174562}.transferPanel input{display:none}`}</style>
    {character && <button onClick={() => exportJson(character)}>EXPORT JSON</button>}
    {character && <button onClick={() => window.open(`/character/${character.id}/print`, '_blank', 'noopener,noreferrer')}>EXPORT / PRINT PDF</button>}
    {characters.length > 0 && <button onClick={exportAll}>EXPORT ALL JSON</button>}
    <button onClick={() => input.current?.click()}>IMPORT JSON</button>
    <input ref={input} type="file" accept="application/json,.json" onChange={e => e.target.files?.[0] && void importJson(e.target.files[0])} />
  </div>
}
