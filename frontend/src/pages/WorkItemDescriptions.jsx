import { useCallback, useEffect, useState } from 'react'
import api from '../api/axios'

const PAGE_SIZE = 10

export default function WorkItemDescriptions({ business }) {
  const [items, setItems] = useState([])
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [editingIdx, setEditingIdx] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    if (!business?.id) return
    setLoading(true)
    try {
      const { data } = await api.get('/work-items/descriptions', { params: { businessId: business.id } })
      setItems(data)
      setPage(0)
    } catch {
      setItems([])
      setPage(0)
    } finally {
      setLoading(false)
    }
  }, [business?.id])

  useEffect(() => { load() }, [load])

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE))
  const pagedItems = items.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)

  function startEdit(idx) {
    setEditingIdx(idx)
    setEditValue(items[idx].description)
    setError('')
  }

  function cancelEdit() {
    setEditingIdx(null)
    setEditValue('')
    setError('')
  }

  async function saveEdit(idx) {
    const oldDescription = items[idx].description
    const newDescription = editValue.trim()
    if (!newDescription || newDescription === oldDescription) { cancelEdit(); return }
    setSaving(true)
    setError('')
    try {
      await api.put('/work-items/description', { businessId: business.id, oldDescription, newDescription })
      cancelEdit()
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Work Item Descriptions</h2>
        <p className="text-sm text-gray-500">
          Correct a description here and it updates every work item that shares it but not any invoice already saved.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading && <div className="p-6 text-center text-gray-400">Loading...</div>}
        {!loading && items.length === 0 && (
          <div className="p-6 text-center text-gray-400">No work item descriptions found.</div>
        )}
        {!loading && items.length > 0 && (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left">Description</th>
                <th className="px-4 py-3 text-right">Used By</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {pagedItems.map((item, localIdx) => {
                const idx = page * PAGE_SIZE + localIdx
                return (
                <tr key={item.description} className="hover:bg-blue-50">
                  <td className="px-4 py-3">
                    {editingIdx === idx ? (
                      <input
                        autoFocus
                        className="w-full border rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') saveEdit(idx); if (e.key === 'Escape') cancelEdit() }}
                      />
                    ) : item.description}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-500">
                    {item.count} item{item.count === 1 ? '' : 's'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {editingIdx === idx ? (
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => saveEdit(idx)}
                          disabled={saving}
                          className="text-xs px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50"
                        >
                          {saving ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={cancelEdit}
                          disabled={saving}
                          className="text-xs px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-lg transition disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEdit(idx)}
                        className="text-xs px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg transition"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
                )
              })}
            </tbody>
          </table>
        )}
        {!loading && items.length > PAGE_SIZE && (
          <div className="flex items-center justify-between px-4 py-3 border-t text-sm text-gray-600">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <span>Page {page + 1} of {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
