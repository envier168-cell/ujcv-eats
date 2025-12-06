import { useState, useCallback } from 'react'
import { ToastContext } from './ToastContext'
import Toast from '../components/Toast'

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ message: '', type: 'success', visible: false })

  const show = useCallback((message, type = 'success', duration = 2500) => {
    setToast({ message, type, visible: true })
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), duration)
  }, [])

  const value = { show }

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast.visible && <Toast message={toast.message} type={toast.type} />}
    </ToastContext.Provider>
  )
}
