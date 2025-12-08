import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { ToastProvider } from './context/ToastProvider'
import { AuthProvider } from './context/AuthContext'   // 🔹 Importa el nuevo AuthProvider
import './global.css' 

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <ToastProvider>
      <AuthProvider>   {/* 🔹 Envuelve la app con AuthProvider */}
        <App />
      </AuthProvider>
    </ToastProvider>
  </BrowserRouter>
)
