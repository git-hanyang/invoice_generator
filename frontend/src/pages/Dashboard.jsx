import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import InvoiceForm from '../components/InvoiceForm'
import InvoiceHistory from '../components/InvoiceHistory'

const TABS = ['New Tax Invoice', 'Tax Invoice History']

export default function Dashboard() {
  const [tab, setTab] = useState(0)
  const [businesses, setBusinesses] = useState([])
  const [activeBusiness, setActiveBusiness] = useState(() => {
    try { return JSON.parse(localStorage.getItem('business')) } catch { return null }
  })
  const navigate = useNavigate()
  const username = localStorage.getItem('username') || 'User'

  useEffect(() => {
    // Redirect to business setup if no business bound yet
    if (!activeBusiness) navigate('/business-setup')
  }, [])

  useEffect(() => {
    api.get('/businesses').then(r => {
      setBusinesses(r.data)
      if (r.data.length === 0) return
      // Always refresh from API (localStorage may be stale after backend updates)
      const fresh = activeBusiness
        ? r.data.find(b => b.id === activeBusiness.id) || r.data[0]
        : r.data[0]
      setActiveBusiness(fresh)
      localStorage.setItem('business', JSON.stringify(fresh))
    }).catch(() => {})
  }, [])

  function handleBusinessChange(id) {
    const b = businesses.find(x => String(x.id) === String(id))
    if (b) {
      setActiveBusiness(b)
      localStorage.setItem('business', JSON.stringify(b))
    }
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('business')
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-700 text-white px-6 py-3 flex items-center justify-between shadow">
        <div>
          <h1 className="text-xl font-bold tracking-wide">
            {activeBusiness ? activeBusiness.name : 'KRS Accounting'}
          </h1>
          {activeBusiness?.nameSecondary && (
            <p className="text-xs opacity-70">{activeBusiness.nameSecondary}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {businesses.length > 1 && (
            <select
              className="text-sm bg-blue-800 border border-blue-600 rounded px-2 py-1 text-white"
              value={activeBusiness?.id || ''}
              onChange={e => handleBusinessChange(e.target.value)}
            >
              {businesses.map(b => (
                <option key={b.id} value={b.id}>{b.code} — {b.name}</option>
              ))}
            </select>
          )}
          <span className="text-sm opacity-80">{username}</span>
          <button onClick={logout} className="text-sm bg-blue-800 hover:bg-blue-900 px-3 py-1 rounded transition">
            Logout
          </button>
        </div>
      </header>

      <div className="flex border-b bg-white px-6">
        {TABS.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className={`px-5 py-3 text-sm font-medium border-b-2 transition ${
              tab === i ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <main className="flex-1 p-6">
        {tab === 0 && <InvoiceForm business={activeBusiness} />}
        {tab === 1 && <InvoiceHistory business={activeBusiness} />}
      </main>
    </div>
  )
}
