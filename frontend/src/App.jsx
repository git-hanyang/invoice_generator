import { useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import BusinessSetup from './pages/BusinessSetup'
import { logAction } from './utils/actionLogger'

function PrivateRoute({ children }) {
  return localStorage.getItem('token') ? children : <Navigate to="/login" replace />
}

function RouteLogger() {
  const location = useLocation()
  const prevPath = useRef(null)

  useEffect(() => {
    if (prevPath.current !== null && prevPath.current !== location.pathname) {
      logAction(`Redirected to ${location.pathname}`)
    }
    prevPath.current = location.pathname
  }, [location.pathname])

  return null
}

export default function App() {
  useEffect(() => {
    function handleClick(e) {
      const btn = e.target.closest('button, [role="button"]')
      if (!btn) return
      const label = btn.getAttribute('aria-label') || btn.textContent.trim() || btn.title || 'unlabeled button'
      logAction(label)
    }
    document.addEventListener('click', handleClick, true)
    return () => document.removeEventListener('click', handleClick, true)
  }, [])

  return (
    <BrowserRouter>
      <RouteLogger />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/business-setup" element={<PrivateRoute><BusinessSetup /></PrivateRoute>} />
        <Route path="/*" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  )
}
