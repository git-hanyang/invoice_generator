import api from '../api/axios'

export function logAction(action) {
  api.post('/actions/log', { action, path: window.location.pathname }).catch(() => {})
}
