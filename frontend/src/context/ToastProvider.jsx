import { createContext, useContext, useState } from 'react'

export const ToastContext = createContext()

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const show = (message, type = 'info', duration = 3000) => {
    // 🔹 Genera un id único combinando timestamp + random
    const id = `${Date.now()}-${Math.random()}`

    setToasts(prev => [...prev, { id, message, type }])

    setTimeout(() => {
      setToasts(current => current.filter(t => t.id !== id))
    }, duration)
  }

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div style={{
        position: 'fixed',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {toasts.map(t => (
          <div
            key={t.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: 8,
              background:
                t.type === 'success'
                  ? '#28a745'
                  : t.type === 'error'
                  ? '#dc3545'
                  : t.type === 'info'
                  ? '#007bff'
                  : '#333',
              color: '#fff',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              fontSize: '0.95rem',
              fontWeight: 500,
              animation: 'toastIn 0.4s ease, toastOut 0.4s ease forwards',
              animationDelay: '0s, 2.6s'
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>
              {t.type === 'success'
                ? ''
                : t.type === 'error'
                ? '❌'
                : t.type === 'info'
                ? 'ℹ️'
                : '🔔'}
            </span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      <style>
        {`
          @keyframes toastIn {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @keyframes toastOut {
            to { transform: translateY(100%); opacity: 0; }
          }
        `}
      </style>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
