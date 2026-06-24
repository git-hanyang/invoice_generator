import { useState, useEffect, useCallback, useRef } from 'react'
import api from '../api/axios'
import InvoiceForm from './InvoiceForm'
import InvoiceTemplate from './InvoiceTemplate'
import { generateInvoicePdf } from '../utils/pdfGenerator'

function toTemplateFormat(data) {
  return {
    invoiceNumber: data.invoiceNumber,
    invoiceDate: data.invoiceDate,
    carPlate: data.customer?.carPlate || '',
    phone: data.customer?.phone || '',
    remark: data.remark || '',
    items: (data.items || []).map(i => ({
      description: i.description,
      quantity: parseFloat(i.quantity),
      unitPrice: parseFloat(i.unitPrice),
      amount: parseFloat(i.amount),
    })),
    totalAmount: parseFloat(data.totalAmount) || 0,
    payments: (data.payments || []).map(p => ({
      amount: parseFloat(p.amount),
      paymentDate: p.paymentDate,
    })),
  }
}

function sortByInvoiceNumberDesc(invoices) {
  return [...invoices].sort((a, b) => {
    const numA = parseInt((a.invoiceNumber || '').replace(/\D/g, '') || '0', 10)
    const numB = parseInt((b.invoiceNumber || '').replace(/\D/g, '') || '0', 10)
    return numB - numA
  })
}

export default function InvoiceHistory({ business }) {
  const [query, setQuery] = useState('')
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(null)
  const [selectedFullData, setSelectedFullData] = useState(null)
  const [editing, setEditing] = useState(false)
  const [editData, setEditData] = useState(null)
  const [generating, setGenerating] = useState(false)
  const previewRef = useRef(null)

  async function handleDownload() {
    if (!previewRef.current) return
    setGenerating(true)
    try {
      const pdf = await generateInvoicePdf(previewRef.current)
      const link = document.createElement('a')
      link.href = pdf
      link.download = `invoice-${selected?.invoiceNumber || 'draft'}.pdf`
      link.click()
    } finally {
      setGenerating(false)
    }
  }

  async function handlePrint() {
    if (!previewRef.current) return
    setGenerating(true)
    const win = window.open('', '_blank')
    try {
      const dataUri = await generateInvoicePdf(previewRef.current)
      const parts = dataUri.split(',')
      const bytes = atob(parts[1])
      const ab = new ArrayBuffer(bytes.length)
      const ia = new Uint8Array(ab)
      for (let i = 0; i < bytes.length; i++) ia[i] = bytes.charCodeAt(i)
      const blob = new Blob([ab], { type: 'application/pdf' })
      win.location.href = URL.createObjectURL(blob)
    } catch {
      win.close()
    } finally {
      setGenerating(false)
    }
  }

  const search = useCallback(async (q) => {
    setLoading(true)
    try {
      const { data } = await api.get('/invoices/search', { params: q ? { query: q } : {} })
      setInvoices(sortByInvoiceNumberDesc(data))
    } catch {
      setInvoices([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { search('') }, [search])

  function handleSearch(e) {
    e.preventDefault()
    search(query)
  }

  async function handleSelect(inv) {
    setEditing(false)
    setEditData(null)
    setSelected(inv)
    setSelectedFullData(null)
    try {
      const { data } = await api.get(`/invoices/${inv.id}`)
      setSelectedFullData(data)
    } catch {
      // no data
    }
  }

  async function handleEdit(inv) {
    setSelected(null)
    setSelectedFullData(null)
    try {
      const { data } = await api.get(`/invoices/${inv.id}`)
      setEditData(data)
      setEditing(true)
    } catch {
      alert('Failed to load invoice.')
    }
  }

  async function handleDelete(inv) {
    if (!window.confirm(`Delete invoice ${inv.invoiceNumber}? This cannot be undone.`)) return
    try {
      await api.delete(`/invoices/number/${encodeURIComponent(inv.invoiceNumber)}`)
      if (selected?.id === inv.id) { setSelected(null); setSelectedFullData(null) }
      search(query)
    } catch {
      alert('Failed to delete invoice.')
    }
  }

  function handleSaved() {
    setEditing(false)
    setEditData(null)
    search(query)
  }

  if (editing && editData) {
    return (
      <div>
        <button
          onClick={() => { setEditing(false); setEditData(null) }}
          className="mb-4 text-sm text-blue-600 hover:underline"
        >
          ← Back to History
        </button>
        <InvoiceForm initialData={editData} onSaved={handleSaved} business={business} />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <h2 className="text-xl font-bold text-gray-800">Tax Invoice History</h2>

      <form onSubmit={handleSearch} className="flex gap-3">
        <input
          className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Search by vehicle no. or phone number..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
        >
          Search
        </button>
        <button
          type="button"
          onClick={() => { setQuery(''); search('') }}
          className="px-4 py-2 bg-gray-200 rounded-lg text-sm hover:bg-gray-300 transition"
        >
          Clear
        </button>
      </form>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading && (
          <div className="p-6 text-center text-gray-400">Loading...</div>
        )}
        {!loading && invoices.length === 0 && (
          <div className="p-6 text-center text-gray-400">No invoices found.</div>
        )}
        {!loading && invoices.length > 0 && (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left">Invoice No</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Vehicle No.</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-right">Total (RM)</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {invoices.map(inv => {
                const isDeleted = !!inv.deletedAt
                return (
                  <tr
                    key={inv.id}
                    className={`cursor-pointer transition ${
                      isDeleted
                        ? 'bg-gray-50 opacity-60'
                        : selected?.id === inv.id ? 'bg-blue-50' : 'hover:bg-blue-50'
                    }`}
                  >
                    <td className={`px-4 py-3 font-medium ${isDeleted ? 'text-gray-400 line-through' : 'text-blue-700'}`} onClick={() => handleSelect(inv)}>
                      {inv.invoiceNumber}
                    </td>
                    <td className="px-4 py-3" onClick={() => handleSelect(inv)}>{inv.invoiceDate}</td>
                    <td className="px-4 py-3 font-medium" onClick={() => handleSelect(inv)}>{inv.customer?.carPlate}</td>
                    <td className="px-4 py-3" onClick={() => handleSelect(inv)}>{inv.customer?.phone}</td>
                    <td className="px-4 py-3 text-right" onClick={() => handleSelect(inv)}>
                      {Number(inv.totalAmount).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {isDeleted ? (
                        <span className="text-xs px-3 py-1 bg-red-50 text-red-400 rounded-lg border border-red-200">
                          Deleted
                        </span>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(inv)}
                            className="text-xs px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(inv)}
                            className="text-xs px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {selected && (
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-700">
              Tax Invoice: {selected.invoiceNumber}
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                disabled={generating || !selectedFullData}
                className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium transition disabled:opacity-50"
              >
                {generating ? 'Generating...' : 'Download PDF'}
              </button>
              <button
                onClick={handlePrint}
                disabled={generating || !selectedFullData}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition disabled:opacity-50"
              >
                Print
              </button>
              <button
                onClick={() => { setSelected(null); setSelectedFullData(null) }}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none ml-1"
              >
                ×
              </button>
            </div>
          </div>
          {selectedFullData ? (
            <div style={{ transform: 'scale(1.15)', transformOrigin: 'top left', marginBottom: '100px', marginRight: '90px' }}>
              <div style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.12)', display: 'inline-block' }}>
                <div ref={previewRef} style={{ background: '#fff' }}>
                  <InvoiceTemplate invoice={toTemplateFormat(selectedFullData)} business={business} />
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Loading...</p>
          )}
        </div>
      )}
    </div>
  )
}
