import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

const emptyForm = {
  code: '', name: '', nameSecondary: '', address: '',
  tel: '', handPhone: '', handPhone2: '', gstRegNo: '',
  specialtyEn: '', specialtyZh: '',
}

export default function BusinessSetup() {
  const navigate = useNavigate()
  const [businesses, setBusinesses] = useState([])
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/businesses').then(r => setBusinesses(r.data)).catch(() => {})
  }, [])

  async function handleSelect(biz) {
    try {
      const { data } = await api.put(`/auth/select-business/${biz.id}`)
      localStorage.setItem('business', JSON.stringify(data))
      navigate('/')
    } catch {
      setError('Failed to select business.')
    }
  }

  async function handleCreate(e) {
    e.preventDefault()
    if (!form.name.trim()) { setError('Business name required'); return }
    setSaving(true)
    setError('')
    try {
      const { data } = await api.post('/businesses', form)
      localStorage.setItem('business', JSON.stringify(data))
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create business.')
    } finally {
      setSaving(false)
    }
  }

  function field(label, key, opts = {}) {
    return (
      <div>
        <label className="block text-sm font-medium mb-1">{label}</label>
        <input
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={form[key]}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          placeholder={opts.placeholder || ''}
          required={opts.required}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Set Up Your Business</h1>
          <p className="text-sm text-gray-500 mt-1">Select an existing business or create a new one.</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>}

        {/* ── Select existing ── */}
        {businesses.length > 0 && (
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="font-semibold text-gray-700 mb-3">Select Existing Business</h2>
            <div className="space-y-2">
              {businesses.map(b => (
                <div key={b.id} className="flex items-center justify-between border rounded-lg px-4 py-3 hover:bg-blue-50 transition">
                  <div>
                    <div className="font-medium text-gray-800">{b.name}</div>
                    {b.nameSecondary && <div className="text-sm text-gray-500">{b.nameSecondary}</div>}
                    <div className="text-xs text-gray-400">{b.code}</div>
                  </div>
                  <button
                    onClick={() => handleSelect(b)}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition"
                  >
                    Select
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={() => setCreating(c => !c)}
                className="text-sm text-blue-600 hover:underline"
              >
                {creating ? '↑ Hide create form' : '+ Create a new business instead'}
              </button>
            </div>
          </div>
        )}

        {/* ── Create new ── */}
        {(creating || businesses.length === 0) && (
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="font-semibold text-gray-700 mb-4">
              {businesses.length === 0 ? 'Create Your Business' : 'Create New Business'}
            </h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {field('Business Name *', 'name', { required: true, placeholder: 'e.g. KAJANG REPAIRS & SERVICE CENTRE' })}
                {field('Chinese Name', 'nameSecondary', { placeholder: 'e.g. 加影汽車修理中心' })}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <textarea
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                  rows={2}
                  value={form.address}
                  onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                  placeholder="Full business address"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {field('Tel', 'tel', { placeholder: '03-xxxx xxxx' })}
                {field('H/P 1', 'handPhone', { placeholder: '01x-xxx xxxx' })}
                {field('H/P 2', 'handPhone2', { placeholder: '01x-xxx xxxx' })}
              </div>
              <div className="grid grid-cols-2 gap-4">
                {field('Short Code', 'code', { placeholder: 'e.g. KRS (auto-generated if blank)' })}
                {field('GST Reg. No.', 'gstRegNo', { placeholder: '000000000000' })}
              </div>
              <div className="grid grid-cols-2 gap-4">
                {field('Specialty (English)', 'specialtyEn', { placeholder: 'e.g. Car Air-Cond., Wiring...' })}
                {field('Specialty (Chinese)', 'specialtyZh', { placeholder: '專修汽車電器...' })}
              </div>
              <button
                type="submit" disabled={saving}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
              >
                {saving ? 'Creating...' : 'Create & Continue'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
