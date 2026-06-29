import { useState, useRef, useEffect } from 'react'
import api from '../api/axios'

export default function CustomerAutocomplete({ value, phone, onChange, onPhoneChange }) {
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
    const v = e.target.value.toUpperCase()
    onChange(v, null)
    clearTimeout(timerRef.current)
    if (v.length < 2) { setSuggestions([]); setOpen(false); return }
    timerRef.current = setTimeout(async () => {
      try {
        const { data } = await api.get('/customers/search', { params: { query: v } })
        setSuggestions(data)
        setOpen(data.length > 0)
      } catch { setSuggestions([]); setOpen(false) }
    }, 250)
  }

  function select(c) {
    onChange(c.carPlate, c.id)
    onPhoneChange(c.phone || '')
    setOpen(false)
    setSuggestions([])
  }

  return (
    <div ref={wrapRef} className="relative">
      <input
        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 uppercase"
        placeholder="Car plate"
        value={value}
        onChange={handleInput}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
      />
      {open && (
        <ul className="absolute z-10 w-full bg-white border rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
          {suggestions.map(c => (
            <li
              key={c.id}
              onMouseDown={() => select(c)}
              className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm flex justify-between"
            >
              <span className="font-medium">{c.carPlate}</span>
              <span className="text-gray-400">{c.phone}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
