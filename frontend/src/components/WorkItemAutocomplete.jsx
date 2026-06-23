import { useState, useRef, useEffect } from 'react'
import api from '../api/axios'

export default function WorkItemAutocomplete({ value, onChange, onSelect }) {
  const [suggestions, setSuggestions] = useState([])
  const [open, setOpen] = useState(false)
  const timerRef = useRef(null)
  const wrapRef = useRef(null)

  useEffect(() => {
    function handler(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function handleInput(e) {
    const v = e.target.value
    onChange(v)
    clearTimeout(timerRef.current)
    if (v.length < 1) { setSuggestions([]); setOpen(false); return }
    timerRef.current = setTimeout(async () => {
      try {
        const { data } = await api.get('/work-items/search', { params: { query: v } })
        setSuggestions(data)
        setOpen(data.length > 0)
      } catch { setSuggestions([]); setOpen(false) }
    }, 250)
  }

  function select(item) {
    onSelect(item)
    setOpen(false)
    setSuggestions([])
  }

  return (
    <div ref={wrapRef} className="relative flex-1">
      <input
        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Work description"
        value={value}
        onChange={handleInput}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
      />
      {open && (
        <ul className="absolute z-10 w-full bg-white border rounded-lg shadow-lg mt-1 max-h-40 overflow-y-auto">
          {suggestions.map(item => (
            <li
              key={item.id}
              onMouseDown={() => select(item)}
              className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm flex justify-between"
            >
              <span>{item.description}</span>
              <span className="text-gray-400 ml-2">RM {Number(item.unitPrice).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
