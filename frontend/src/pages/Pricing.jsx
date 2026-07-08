import { useState, useRef } from 'react'
import api from '../api/axios'

function formatPrice(v) {
  const n = Number(v)
  return Number.isFinite(n) ? `RM ${n.toFixed(2)}` : '-'
}

function SearchBox({ label, placeholder, onSearch }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [open, setOpen] = useState(false)
  const timerRef = useRef(null)

  function handleInput(e) {
    const v = e.target.value
    setQuery(v)
    clearTimeout(timerRef.current)
    if (v.trim().length < 1) { setResults([]); setOpen(false); return }
    timerRef.current = setTimeout(async () => {
      try {
        const data = await onSearch(v.trim())
        setResults(data)
        setOpen(true)
      } catch { setResults([]); setOpen(false) }
    }, 250)
  }

  return (
    <div className="flex-1">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder={placeholder}
        value={query}
        onChange={handleInput}
        onFocus={() => results.length > 0 && setOpen(true)}
      />
      {open && (
        <div className="mt-2 border rounded-lg shadow-sm max-h-72 overflow-y-auto bg-white">
          {results.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-400">No matches</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="text-left px-3 py-2">Description</th>
                  <th className="text-left px-3 py-2">Vehicle Model</th>
                  <th className="text-right px-3 py-2">Unit Price</th>
                </tr>
              </thead>
              <tbody>
                {results.map(item => (
                  <tr key={item.id} className="border-t hover:bg-blue-50">
                    <td className="px-3 py-2">{item.description}</td>
                    <td className="px-3 py-2 text-gray-500">{item.vehicleModel || '-'}</td>
                    <td className="px-3 py-2 text-right font-medium">{formatPrice(item.unitPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}

export default function Pricing({ business }) {
  async function searchByDescription(query) {
    const { data } = await api.get('/work-items/search', { params: { query, businessId: business?.id, allVehicleModels: true } })
    return data
  }

  async function searchByVehicleModel(query) {
    const { data } = await api.get('/work-items/search/vehicle-model', { params: { query, businessId: business?.id } })
    return data
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">Pricing Lookup</h2>
        {business?.name && <p className="text-sm text-gray-500">{business.name}</p>}
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <SearchBox
          label="Search by Vehicle Model"
          placeholder="e.g. Perodua Myvi"
          onSearch={searchByVehicleModel}
        />
        <SearchBox
          label="Search by Description"
          placeholder="e.g. Brake pad replacement"
          onSearch={searchByDescription}
        />
      </div>
    </div>
  )
}
