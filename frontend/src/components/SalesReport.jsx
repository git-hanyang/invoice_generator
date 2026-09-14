import { useState } from 'react'
import api from '../api/axios'
import InvoiceTemplate from './InvoiceTemplate'
import { toTemplateFormat } from './InvoiceHistory'

function today() {
  return new Date().toISOString().slice(0, 10)
}

const PAGE_SIZE = 10

export default function SalesReport({ business }) {
  const [from, setFrom] = useState(today())
  const [to, setTo] = useState(today())
  const [summary, setSummary] = useState(null)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [selectedFullData, setSelectedFullData] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSummary(null)
    setPage(0)
    setSelectedItem(null)
    setSelectedFullData(null)
    try {
      const { data } = await api.get('/invoices/sales-summary', { params: { from, to } })
      setSummary(data)
    } catch {
      setError('Failed to load sales summary.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSelect(item) {
    setSelectedItem(item)
    setSelectedFullData(null)
    try {
      const { data } = await api.get(`/invoices/${item.id}`)
      setSelectedFullData(data)
    } catch {
      // no data
    }
  }

  const totalPages = summary ? Math.max(1, Math.ceil(summary.items.length / PAGE_SIZE)) : 1
  const pagedItems = summary ? summary.items.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE) : []

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <h2 className="text-xl font-bold text-gray-800">Sales Report</h2>

      <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">From</label>
          <input
            type="date"
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={from}
            max={to}
            onChange={e => setFrom(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">To</label>
          <input
            type="date"
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={to}
            min={from}
            onChange={e => setTo(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Show Sales'}
        </button>
      </form>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {summary && (
        <>
          <div className="bg-white rounded-xl shadow p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Sales ({from} to {to})</p>
              <p className="text-3xl font-bold text-blue-700">RM {Number(summary.totalAmount).toFixed(2)}</p>
            </div>
            <p className="text-sm text-gray-500">{summary.invoiceCount} invoice{summary.invoiceCount === 1 ? '' : 's'}</p>
          </div>

          <div className="bg-white rounded-xl shadow overflow-hidden">
            {summary.items.length === 0 ? (
              <div className="p-6 text-center text-gray-400">No invoices in this period.</div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-4 py-3 text-left">Invoice No</th>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-right">Amount (RM)</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {pagedItems.map(item => (
                    <tr
                      key={item.invoiceNumber}
                      className={`cursor-pointer transition ${selectedItem?.id === item.id ? 'bg-blue-50' : 'hover:bg-blue-50'}`}
                      onClick={() => handleSelect(item)}
                    >
                      <td className="px-4 py-3 font-medium text-blue-700">{item.invoiceNumber}</td>
                      <td className="px-4 py-3">{item.invoiceDate}</td>
                      <td className="px-4 py-3 text-right">{Number(item.totalAmount).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t bg-gray-50 font-semibold">
                    <td className="px-4 py-3" colSpan={2}>Total</td>
                    <td className="px-4 py-3 text-right">{Number(summary.totalAmount).toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            )}
            {summary.items.length > PAGE_SIZE && (
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

          {selectedItem && (
            <div className="bg-white rounded-xl shadow p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-700">
                  Tax Invoice: {selectedItem.invoiceNumber}
                </h3>
                <button
                  onClick={() => { setSelectedItem(null); setSelectedFullData(null) }}
                  className="text-gray-400 hover:text-gray-600 text-xl leading-none ml-1"
                >
                  ×
                </button>
              </div>
              {selectedFullData ? (
                <div style={{ transform: 'scale(1.15)', transformOrigin: 'top left', marginBottom: '100px', marginRight: '90px' }}>
                  <div style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.12)', display: 'inline-block' }}>
                    <InvoiceTemplate invoice={toTemplateFormat(selectedFullData)} business={business} />
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">Loading...</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
