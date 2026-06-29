const DEFAULT_BUSINESS = {
  name: 'KAJANG REPAIRS & SERVICE CENTRE',
  address: '23, Jalan Zamrud 1, Taman Zamrud, Batu 16, Jln. Semenyih, 43000 Kajang, Selangor.',
  tel: '03-8736 8123',
  handPhone: '019-228 0492',
  gstRegNo: '000957243392',
  specialtyEn: 'Specialist in Car Air-Cond., Car Wiring, Checking, Alternater, Starter & Engine.',
}

const cell = (extra = {}) => ({
  border: '1px solid #bbb',
  padding: '3px 5px',
  verticalAlign: 'top',
  ...extra,
})

const hcell = (extra = {}) => ({
  border: '1px solid #555',
  padding: '4px 5px',
  fontWeight: '700',
  background: '#fff',
  ...extra,
})

export default function InvoiceTemplate({ invoice, business }) {
  const biz = business || DEFAULT_BUSINESS
  const {
    invoiceNumber = '',
    invoiceDate = '',
    carPlate = '',
    phone = '',
    remark = '',
    items = [],
    totalAmount = 0,
    payments = [],
  } = invoice || {}

  const paidTotal = payments.reduce((s, p) => s + (parseFloat(p.amount) || 0), 0)
  const total = parseFloat(totalAmount) || 0
  const remaining = total - paidTotal
  const fmt = n => Number(n || 0).toFixed(2)
  const fmtQty = n => { const v = Number(n || 0); return Number.isInteger(v) ? String(v) : v.toFixed(2) }

  return (
    <div style={{
      width: '148mm',
      fontFamily: "'Helvetica Neue', Helvetica, 'Segoe UI', Arial, sans-serif",
      fontSize: '10px',
      color: '#111',
      background: '#fff',
      padding: '10mm 8mm',
      boxSizing: 'border-box',
      lineHeight: '1.4',
    }}>
      {/* ── Business Header ── */}
      <div style={{
        border: '1.5px solid #111',
        padding: '10px 14px',
        textAlign: 'center',
        marginBottom: '8px',
      }}>
        <div style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '0.5px', marginBottom: '2px' }}>
          {biz.name}
        </div>
        {biz.address && (
          <div style={{ fontSize: '11px', marginBottom: '4px' }}>{biz.address}</div>
        )}
        <div style={{ fontSize: '11px', marginBottom: '2px' }}>
          {biz.tel && <span>Tel: {biz.tel}</span>}
          {biz.tel && biz.handPhone && <span style={{ margin: '0 8px' }}>|</span>}
          {biz.handPhone && <span>H/P: {biz.handPhone}</span>}
          {biz.handPhone2 && <span style={{ margin: '0 8px' }}>|</span>}
          {biz.handPhone2 && <span>H/P: {biz.handPhone2}</span>}
        </div>
        {biz.gstRegNo && (
          <div style={{ fontSize: '11px', fontWeight: '700', marginBottom: '2px' }}>
            GST Reg. No.: {biz.gstRegNo}
          </div>
        )}
        {biz.specialtyEn && (
          <div style={{ borderTop: '1px solid #aaa', marginTop: '5px', paddingTop: '4px' }}>
            <div style={{ fontSize: '10px', fontStyle: 'italic', color: '#444' }}>{biz.specialtyEn}</div>
          </div>
        )}
      </div>

      {/* ── INVOICE title ── */}
      <div style={{
        textAlign: 'center',
        fontSize: '13px',
        fontWeight: '700',
        letterSpacing: '4px',
        padding: '10px 0',
        color: '#111',
      }}>
        TAX INVOICE
      </div>

      {/* ── Meta: Left = Car Plate + Phone, Right = Invoice No + Date ── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        borderTop: '1.5px solid #111',
        padding: '5px 2px',
        marginBottom: '7px',
      }}>
        <div>
          <div style={{ marginBottom: '3px' }}>
            <span style={{ fontWeight: '700' }}>Vehicle No.:&nbsp;</span>
            <span style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '1px' }}>{carPlate}</span>
          </div>
          <div>
            <span style={{ fontWeight: '700' }}>H/P:&nbsp;</span>
            <span>{phone}</span>
          </div>
        </div>
        <div style={{ textAlign: 'right', minWidth: '160px' }}>
          <div style={{ marginBottom: '3px' }}>
            <span style={{ fontWeight: '700' }}>Invoice No.:&nbsp;</span>
            <span>{invoiceNumber}</span>
          </div>
          <div>
            <span style={{ fontWeight: '700' }}>Date:&nbsp;</span>
            <span>{invoiceDate ? String(invoiceDate) : ''}</span>
          </div>
        </div>
      </div>

      {/* ── Items Table ── */}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px', marginBottom: '5px' }}>
        <thead>
          <tr>
            <th style={hcell({ width: '22px', textAlign: 'center' })}>#</th>
            <th style={hcell({ textAlign: 'left' })}>Description</th>
            <th style={hcell({ width: '34px', textAlign: 'center' })}>Qty</th>
            <th style={hcell({ width: '66px', textAlign: 'right' })}>Unit Price (RM)</th>
            <th style={hcell({ width: '66px', textAlign: 'right' })}>Amount (RM)</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i}>
              <td style={cell({ textAlign: 'center' })}>{i + 1}</td>
              <td style={cell({ wordBreak: 'break-word', whiteSpace: 'pre-wrap' })}>{item.description}</td>
              <td style={cell({ textAlign: 'right' })}>{fmtQty(item.quantity)}</td>
              <td style={cell({ textAlign: 'right' })}>{fmt(item.unitPrice)}</td>
              <td style={cell({ textAlign: 'right' })}>{fmt(item.amount)}</td>
            </tr>
          ))}
          {items.length < 8 && Array.from({ length: 8 - items.length }).map((_, i) => (
            <tr key={`empty-${i}`}>
              <td style={cell({ color: 'transparent' })}>-</td>
              <td style={cell()}>&nbsp;</td>
              <td style={cell()}>&nbsp;</td>
              <td style={cell()}>&nbsp;</td>
              <td style={cell()}>&nbsp;</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ── Remark ── */}
      {remark && (
        <div style={{
          border: '1px solid #bbb',
          borderRadius: '2px',
          padding: '4px 7px',
          marginBottom: '6px',
          fontSize: '10px',
          width: 'calc(100% - 168px)',
          boxSizing: 'border-box',
        }}>
          <span style={{ fontWeight: '700' }}>Remarks:&nbsp;</span>
          <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{remark}</span>
        </div>
      )}

      {/* ── Totals ── */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
        <table style={{ fontSize: '10px', borderCollapse: 'collapse', width: '168px', tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: '102px' }} />
            <col style={{ width: '66px' }} />
          </colgroup>
          <tbody>
            <tr>
              <td style={{ padding: '3px 8px', textAlign: 'right', fontWeight: '700', border: 'none' }}>
                Total:
              </td>
              <td style={{ padding: '3px 8px', textAlign: 'right', fontWeight: '700', border: 'none' }}>
                RM {fmt(totalAmount)}
              </td>
            </tr>
            {payments.map((p, i) => (
              <tr key={i}>
                <td style={{ padding: '2px 8px', textAlign: 'right', color: '#444', fontSize: '9px' }}>
                  Paid ({p.paymentDate || ''}):
                </td>
                <td style={{ padding: '2px 8px', textAlign: 'right', color: '#444', fontSize: '9px' }}>
                  RM {fmt(p.amount)}
                </td>
              </tr>
            ))}
            {payments.length > 0 && (
              <>
                <tr>
                  <td colSpan={2} style={{ padding: '0', lineHeight: '0', fontSize: '0', borderTop: '1.5px solid #111', borderBottom: 'none', borderLeft: 'none', borderRight: 'none' }} />
                </tr>
                <tr>
                  <td style={{
                    padding: '3px 8px',
                    textAlign: 'right',
                    fontWeight: '700',
                    color: remaining <= 0 ? '#006600' : '#bb0000',
                  }}>
                    Balance Due:
                  </td>
                  <td style={{
                    padding: '3px 8px',
                    textAlign: 'right',
                    fontWeight: '700',
                    color: remaining <= 0 ? '#006600' : '#bb0000',
                  }}>
                    RM {remaining.toFixed(2)}{remaining <= 0 ? ' ✓' : ''}
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Signature / Footer ── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '12px',
        paddingTop: '8px',
        borderTop: '1px solid #ddd',
        fontSize: '10px',
        color: '#555',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '33px' }}>Customer Signature:</div>
          <div style={{ borderBottom: '1px solid #aaa', width: '100px', margin: '0 auto' }} />
        </div>
        <div style={{ textAlign: 'center', color: '#777' }}>
          <div>Thank you for your business!</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '33px' }}>Authorised By:</div>
          <div style={{ borderBottom: '1px solid #aaa', width: '100px', margin: '0 auto' }} />
        </div>
      </div>
    </div>
  )
}
