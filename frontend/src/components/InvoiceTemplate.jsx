const DEFAULT_BUSINESS = {
  name: 'KAJANG REPAIRS & SERVICE CENTRE',
  nameSecondary: '加影汽車修理中心',
  address: '23, Jalan Zamrud 1, Taman Zamrud, Batu 16, Jln. Semenyih, 43000 Kajang, Selangor.',
  tel: '03-8736 8123',
  handPhone: '019-228 0492',
  gstRegNo: '000957243392',
  specialtyEn: 'Specialist in Car Air-Cond., Car Wiring, Checking, Alternater, Starter & Engine.',
  specialtyZh: '專修理汽車電器,冷氣,引擎與貴進口各國本地電池',
}

const cell = (extra = {}) => ({
  border: '1px solid #bbb',
  padding: '3px 5px',
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

  return (
    <div style={{
      width: '148mm',
      fontFamily: 'Arial, "Microsoft YaHei", "PingFang SC", "SimHei", sans-serif',
      fontSize: '8.5px',
      color: '#111',
      background: '#fff',
      padding: '10mm 8mm',
      boxSizing: 'border-box',
      lineHeight: '1.4',
    }}>
      {/* ── Business Header ── */}
      <div style={{
        border: '1.5px solid #111',
        padding: '8px 12px',
        textAlign: 'center',
        marginBottom: '2px',
      }}>
        <div style={{ fontSize: '14px', fontWeight: '800', letterSpacing: '0.5px', marginBottom: '2px' }}>
          {biz.name}
        </div>
        {biz.nameSecondary && (
          <div style={{ fontSize: '11px', marginBottom: '3px' }}>{biz.nameSecondary}</div>
        )}
        {biz.address && (
          <div style={{ fontSize: '7.5px', color: '#333', marginBottom: '2px' }}>{biz.address}</div>
        )}
        <div style={{ fontSize: '7.5px', marginBottom: '2px' }}>
          {biz.tel && <span>Tel: {biz.tel}</span>}
          {biz.tel && biz.handPhone && <span style={{ margin: '0 8px' }}>|</span>}
          {biz.handPhone && <span>H/P: {biz.handPhone}</span>}
          {biz.handPhone2 && <span style={{ margin: '0 8px' }}>|</span>}
          {biz.handPhone2 && <span>H/P: {biz.handPhone2}</span>}
        </div>
        {biz.gstRegNo && (
          <div style={{ fontSize: '7.5px', fontWeight: '700', marginBottom: '2px' }}>
            GST Reg. No.: {biz.gstRegNo}
          </div>
        )}
        {(biz.specialtyZh || biz.specialtyEn) && (
          <div style={{ borderTop: '1px solid #aaa', marginTop: '5px', paddingTop: '4px' }}>
            {biz.specialtyZh && (
              <div style={{ fontSize: '8px', marginBottom: '2px' }}>{biz.specialtyZh}</div>
            )}
            {biz.specialtyEn && (
              <div style={{ fontSize: '7px', fontStyle: 'italic', color: '#444' }}>{biz.specialtyEn}</div>
            )}
          </div>
        )}
      </div>

      {/* ── INVOICE title ── */}
      <div style={{
        textAlign: 'center',
        fontSize: '10.5px',
        fontWeight: '700',
        letterSpacing: '4px',
        padding: '5px 0',
        color: '#111',
      }}>
        INVOICE &nbsp;/&nbsp; 發票
      </div>

      {/* ── Meta: Left = Car Plate + Phone, Right = Invoice No + Date ── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        borderTop: '1.5px solid #111',
        borderBottom: '1.5px solid #111',
        padding: '5px 2px',
        marginBottom: '7px',
      }}>
        <div>
          <div style={{ marginBottom: '3px' }}>
            <span style={{ fontWeight: '700' }}>Car Plate:&nbsp;</span>
            <span style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '1px' }}>{carPlate}</span>
          </div>
          <div>
            <span style={{ fontWeight: '700' }}>H/P:&nbsp;</span>
            <span>{phone}</span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
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
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '8px', marginBottom: '5px' }}>
        <thead>
          <tr>
            <th style={hcell({ width: '22px', textAlign: 'center' })}>#</th>
            <th style={hcell({ textAlign: 'left' })}>Description / 說明</th>
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
              <td style={cell({ textAlign: 'right' })}>{fmt(item.quantity)}</td>
              <td style={cell({ textAlign: 'right' })}>{fmt(item.unitPrice)}</td>
              <td style={cell({ textAlign: 'right' })}>{fmt(item.amount)}</td>
            </tr>
          ))}
          {items.length < 5 && Array.from({ length: 5 - items.length }).map((_, i) => (
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
          fontSize: '8px',
        }}>
          <span style={{ fontWeight: '700' }}>Remarks:&nbsp;</span>
          <span>{remark}</span>
        </div>
      )}

      {/* ── Totals ── */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
        <table style={{ fontSize: '8.5px', borderCollapse: 'collapse', minWidth: '190px' }}>
          <tbody>
            <tr>
              <td style={{ padding: '3px 8px', textAlign: 'right', fontWeight: '700', borderTop: '1.5px solid #111' }}>
                Total:
              </td>
              <td style={{ padding: '3px 8px', textAlign: 'right', fontWeight: '700', borderTop: '1.5px solid #111', minWidth: '80px' }}>
                RM {fmt(totalAmount)}
              </td>
            </tr>
            {payments.map((p, i) => (
              <tr key={i}>
                <td style={{ padding: '2px 8px', textAlign: 'right', color: '#444', fontSize: '8px' }}>
                  Paid ({p.paymentDate || ''}):
                </td>
                <td style={{ padding: '2px 8px', textAlign: 'right', color: '#444', fontSize: '8px' }}>
                  RM {fmt(p.amount)}
                </td>
              </tr>
            ))}
            {payments.length > 0 && (
              <tr>
                <td style={{
                  padding: '3px 8px',
                  textAlign: 'right',
                  fontWeight: '700',
                  borderTop: '1.5px solid #111',
                  color: remaining <= 0 ? '#006600' : '#bb0000',
                }}>
                  Balance Due:
                </td>
                <td style={{
                  padding: '3px 8px',
                  textAlign: 'right',
                  fontWeight: '700',
                  borderTop: '1.5px solid #111',
                  color: remaining <= 0 ? '#006600' : '#bb0000',
                }}>
                  RM {remaining.toFixed(2)}{remaining <= 0 ? ' ✓' : ''}
                </td>
              </tr>
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
        fontSize: '8px',
        color: '#555',
      }}>
        <div>
          <div style={{ marginBottom: '16px' }}>Customer Signature:</div>
          <div style={{ borderBottom: '1px solid #aaa', width: '100px' }} />
        </div>
        <div style={{ textAlign: 'center', color: '#777' }}>
          <div>Thank you for your business!</div>
          <div style={{ marginTop: '2px' }}>歡迎再次光臨</div>
        </div>
        <div>
          <div style={{ marginBottom: '16px' }}>Authorised By:</div>
          <div style={{ borderBottom: '1px solid #aaa', width: '100px' }} />
        </div>
      </div>
    </div>
  )
}
