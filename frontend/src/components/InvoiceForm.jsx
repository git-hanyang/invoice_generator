import { useState, useRef, useEffect } from 'react'
import api from '../api/axios'
import CustomerAutocomplete from './CustomerAutocomplete'
import WorkItemAutocomplete from './WorkItemAutocomplete'
import InvoiceTemplate from './InvoiceTemplate'
import { generateInvoicePdf } from '../utils/pdfGenerator'

const emptyItem = () => ({ description: '', quantity: '1', unitPrice: '', amount: '' })
const emptyPayment = () => ({ amount: '', paymentDate: new Date().toISOString().split('T')[0] })

function calcAmount(qty, price) {
  const q = parseFloat(qty) || 0
  const p = parseFloat(price) || 0
  return (q * p).toFixed(2)
}

export default function InvoiceForm({ initialData, onSaved, business }) {
  const today = new Date().toISOString().split('T')[0]
  const previewRef = useRef(null)
  const pdfRef = useRef(null)

  // Auto-fill next invoice number for new invoices
  useEffect(() => {
    if (!initialData) {
      api.get('/invoices/next-number').then(r => setInvoiceNumber(r.data.invoiceNumber)).catch(() => {})
    }
  }, [])

  const [invoiceNumber, setInvoiceNumber] = useState(initialData?.invoiceNumber || '')
  const [invoiceDate, setInvoiceDate] = useState(initialData?.invoiceDate || today)
  const [carPlate, setCarPlate] = useState(initialData?.customer?.carPlate || '')
  const [customerId, setCustomerId] = useState(initialData?.customer?.id || null)
  const [phone, setPhone] = useState(initialData?.customer?.phone || '')
  const [remark, setRemark] = useState(initialData?.remark || '')
  const [items, setItems] = useState(
    initialData?.items?.length
      ? initialData.items.map(i => ({
          description: i.description,
          quantity: String(i.quantity),
          unitPrice: String(i.unitPrice),
          amount: String(i.amount),
        }))
      : [emptyItem()]
  )
  const [payments, setPayments] = useState(
    initialData?.payments?.length
      ? initialData.payments.map(p => ({
          amount: String(p.amount),
          paymentDate: String(p.paymentDate),
        }))
      : []
  )
  const [saving, setSaving] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [msg, setMsg] = useState('')

  const total = items.reduce((s, i) => s + (parseFloat(i.amount) || 0), 0)
  const paidTotal = payments.reduce((s, p) => s + (parseFloat(p.amount) || 0), 0)
  const remaining = total - paidTotal

  function updateItem(idx, field, val) {
    setItems(prev => {
      const next = [...prev]
      next[idx] = { ...next[idx], [field]: val }
      if (field === 'quantity' || field === 'unitPrice') {
        next[idx].amount = calcAmount(
          field === 'quantity' ? val : next[idx].quantity,
          field === 'unitPrice' ? val : next[idx].unitPrice
        )
      }
      return next
    })
  }

  function addItem() { setItems(p => [...p, emptyItem()]) }
  function removeItem(idx) { setItems(p => p.filter((_, i) => i !== idx)) }

  function handleSelectWorkItem(idx, item) {
    setItems(prev => {
      const next = [...prev]
      next[idx] = {
        description: item.description,
        quantity: '1',
        unitPrice: String(item.unitPrice),
        amount: String(item.unitPrice),
      }
      return next
    })
  }

  function addPayment() { setPayments(p => [...p, emptyPayment()]) }
  function removePayment(idx) { setPayments(p => p.filter((_, i) => i !== idx)) }
  function updatePayment(idx, field, val) {
    setPayments(prev => {
      const next = [...prev]
      next[idx] = { ...next[idx], [field]: val }
      return next
    })
  }

  function handleCarPlateChange(plate, id) {
    setCarPlate(plate)
    setCustomerId(id)
  }

  async function handleDeleteInvoiceNumber() {
    if (!invoiceNumber) return
    if (!window.confirm(`Delete invoice ${invoiceNumber}?`)) return
    try {
      await api.delete(`/invoices/number/${encodeURIComponent(invoiceNumber)}`)
      setInvoiceNumber('')
      setMsg('Invoice deleted.')
    } catch {
      setMsg('Delete failed.')
    }
  }

  function invoiceData() {
    return {
      invoiceNumber,
      invoiceDate,
      carPlate,
      phone,
      remark,
      items: items.map(i => ({
        description: i.description,
        quantity: parseFloat(i.quantity) || 1,
        unitPrice: parseFloat(i.unitPrice) || 0,
        amount: parseFloat(i.amount) || 0,
      })),
      totalAmount: total,
      payments: payments.map(p => ({
        amount: parseFloat(p.amount) || 0,
        paymentDate: p.paymentDate,
      })),
    }
  }

  async function buildPdf() {
    if (!pdfRef.current) throw new Error('Preview not mounted')
    return generateInvoicePdf(pdfRef.current)
  }

  async function handleDownloadPdf() {
    setGenerating(true)
    setMsg('')
    try {
      const pdf = await buildPdf()
      const link = document.createElement('a')
      link.href = pdf
      link.download = `invoice-${invoiceNumber || 'draft'}.pdf`
      link.click()
    } catch {
      setMsg('PDF generation failed.')
    } finally {
      setGenerating(false)
    }
  }

  async function handleSave() {
    if (!invoiceNumber.trim()) { setMsg('Invoice number required.'); return }
    if (!carPlate.trim()) { setMsg('Car plate required.'); return }
    setGenerating(true)
    setSaving(true)
    setMsg('')
    try {
      const pdfBase64 = await buildPdf()

      const payload = {
        invoiceNumber: invoiceNumber.trim(),
        carPlate: carPlate.trim(),
        phone: phone.trim(),
        customerId,
        invoiceDate,
        totalAmount: total,
        remark: remark.trim(),
        items: items.map((i, idx) => ({
          description: i.description,
          quantity: parseFloat(i.quantity) || 1,
          unitPrice: parseFloat(i.unitPrice) || 0,
          amount: parseFloat(i.amount) || 0,
          sortOrder: idx,
        })),
        payments: payments.map(p => ({
          amount: parseFloat(p.amount) || 0,
          paymentDate: p.paymentDate,
        })),
        pdfBase64,
      }
      await api.post('/invoices', payload)
      setMsg('Invoice saved successfully.')
      if (onSaved) onSaved()
    } catch (err) {
      setMsg(err.response?.data?.message || 'Save failed.')
    } finally {
      setGenerating(false)
      setSaving(false)
    }
  }

  return (
    <div className="max-w-[1664px] mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-bold text-gray-800">{initialData ? 'Edit Tax Invoice' : 'New Tax Invoice'}</h2>
        {!initialData && (
          <button
            onClick={() => {
              api.get('/invoices/next-number').then(r => setInvoiceNumber(r.data.invoiceNumber)).catch(() => {})
              setInvoiceDate(today)
              setCarPlate('')
              setCustomerId(null)
              setPhone('')
              setRemark('')
              setItems([emptyItem()])
              setPayments([])
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-blue-600 border border-blue-200 hover:bg-blue-50 transition"
            title="Clear form for new invoice"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
            </svg>
            New
          </button>
        )}
      </div>

      <div className="flex gap-6">
        {/* ── Left column: form fields ── */}
        <div className="flex-1 space-y-5 min-w-0">

          {/* Invoice header */}
          <div className="bg-white rounded-xl shadow p-5 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Invoice Number</label>
              <div className="flex gap-2">
                <input
                  className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="e.g. INV-001"
                  value={invoiceNumber}
                  onChange={e => setInvoiceNumber(e.target.value)}
                />
                {initialData && invoiceNumber && (
                  <button
                    onClick={handleDeleteInvoiceNumber}
                    className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg text-sm transition"
                    title="Delete this invoice"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Invoice Date</label>
              <input
                type="date"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={invoiceDate}
                onChange={e => setInvoiceDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Vehicle No.</label>
              <CustomerAutocomplete
                value={carPlate}
                phone={phone}
                onChange={handleCarPlateChange}
                onPhoneChange={setPhone}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <input
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="e.g. 0123456789"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </div>
          </div>

          {/* Line items */}
          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="font-semibold mb-3 text-gray-700">Work Done</h3>
            <div className="flex gap-2 items-center text-xs text-gray-400 mb-1 px-1">
                <span className="w-5"></span>
                <span className="flex-1 min-w-0">Description</span>
                <span className="w-14 text-right">Qty</span>
                <span className="w-20 text-right">Unit (RM)</span>
                <span className="w-20 text-right">Amount (RM)</span>
                <span className="w-6"></span>
              </div>
            <div className="space-y-2">
              {items.map((item, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <span className="text-sm text-gray-400 w-5 text-right">{idx + 1}.</span>
                  <WorkItemAutocomplete
                    value={item.description}
                    onChange={val => updateItem(idx, 'description', val)}
                    onSelect={wi => handleSelectWorkItem(idx, wi)}
                  />
                  <input
                    className="border rounded-lg px-2 py-2 text-sm w-14 text-right focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={e => updateItem(idx, 'quantity', e.target.value)}
                    type="number" min="0"
                  />
                  <input
                    className="border rounded-lg px-2 py-2 text-sm w-20 text-right focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="0.00"
                    value={item.unitPrice}
                    onChange={e => updateItem(idx, 'unitPrice', e.target.value)}
                    type="number" min="0"
                  />
                  <input
                    className="border rounded-lg px-2 py-2 text-sm w-20 text-right bg-gray-50"
                    placeholder="0.00"
                    value={item.amount}
                    readOnly
                  />
                  <button onClick={() => removeItem(idx)} className="text-red-400 hover:text-red-600 px-1 text-lg">×</button>
                </div>
              ))}
            </div>
            <button onClick={addItem} className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium">
              + Add Row
            </button>
            <div className="mt-4 flex justify-end">
              <span className="text-lg font-bold">Total: RM {total.toFixed(2)}</span>
            </div>
          </div>

          {/* Remark */}
          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="font-semibold mb-2 text-gray-700">Remarks</h3>
            <textarea
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              placeholder="Optional remarks or notes..."
              rows={2}
              value={remark}
              onChange={e => setRemark(e.target.value)}
            />
          </div>

          {/* Payments */}
          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="font-semibold mb-3 text-gray-700">Payments</h3>
            {payments.length === 0 && (
              <p className="text-sm text-gray-400 mb-2">No payments recorded.</p>
            )}
            <div className="space-y-2">
              {payments.map((p, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <span className="text-sm text-gray-400 w-5 text-right">{idx + 1}.</span>
                  <input
                    type="number"
                    className="border rounded-lg px-3 py-2 text-sm w-32 text-right focus:outline-none focus:ring-2 focus:ring-green-400"
                    placeholder="Amount (RM)"
                    value={p.amount}
                    onChange={e => updatePayment(idx, 'amount', e.target.value)}
                    min="0" step="0.01"
                  />
                  <input
                    type="date"
                    className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                    value={p.paymentDate}
                    onChange={e => updatePayment(idx, 'paymentDate', e.target.value)}
                  />
                  <button onClick={() => removePayment(idx)} className="text-red-400 hover:text-red-600 px-1 text-lg">×</button>
                </div>
              ))}
            </div>
            <button onClick={addPayment} className="mt-3 text-sm text-green-600 hover:text-green-800 font-medium">
              + Add Payment
            </button>
            <div className="mt-4 space-y-1 text-right">
              <div className="text-sm text-gray-600">Total Paid: <span className="font-semibold">RM {paidTotal.toFixed(2)}</span></div>
              <div className={`text-base font-bold ${remaining <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                Balance Due: RM {remaining.toFixed(2)}
                {remaining <= 0 && <span className="ml-2 text-xs font-normal">✓ Fully Paid</span>}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 items-center">
            <button
              onClick={handleDownloadPdf}
              disabled={generating}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium transition disabled:opacity-50"
            >
              {generating && !saving ? 'Generating...' : 'Download PDF'}
            </button>
            <button
              onClick={handleSave}
              disabled={generating || saving}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Invoice'}
            </button>
            {msg && (
              <span className={`text-sm ${msg.includes('success') ? 'text-green-600' : 'text-red-500'}`}>
                {msg}
              </span>
            )}
          </div>
        </div>

        {/* ── Right column: live invoice preview ── */}
        <div className="flex-shrink-0 w-[660px]">
          <div className="sticky top-4">
            <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Live Preview</p>
            <div style={{ transform: 'scale(1.15)', transformOrigin: 'top left', marginBottom: '100px', marginRight: '90px' }}>
              <div
                style={{
                  boxShadow: '0 2px 16px rgba(0,0,0,0.12)',
                  display: 'inline-block',
                }}
              >
                <div ref={pdfRef} style={{ background: '#fff' }}>
                  <InvoiceTemplate invoice={invoiceData()} business={business} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
