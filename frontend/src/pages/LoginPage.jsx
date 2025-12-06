import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../context/ToastProvider'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [address, setAddress] = useState('')
  const navigate = useNavigate()
  const { show } = useToast()

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('userInfo') || '{}')
    setAddress(stored.address || 'Dirección de ejemplo')
  }, [])

  const handleLogin = () => {
    localStorage.setItem('userInfo', JSON.stringify({
      name: 'Usuario de ejemplo',
      email: email || 'correo@ejemplo.com',
      accountNumber: accountNumber || '0000000000',
      address: address || 'Dirección de ejemplo'
    }))

    show('✅ Sesión iniciada', 'success', 3000)
    show('⚠️ Este es un proyecto de ejemplo. Los datos no son reales ni se validan.', 'warning', 5000)

    navigate('/')
  }

  return (
    <div 
      style={{ 
        display: 'flex', 
        height: '100vh', 
        width: '100vw',
        overflow: 'hidden',
        flexDirection: window.innerWidth < 768 ? 'column' : 'row' // 🔹 Responsive: columna en móviles
      }}
    >
      {/* Izquierda: columna compacta */}
      <div style={{ 
        width: window.innerWidth < 768 ? '100%' : '320px', // 🔹 Full width en móviles
        padding: window.innerWidth < 768 ? '1.5rem' : '2rem 1.5rem 2rem 2rem',
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        boxShadow: '0 0 12px rgba(0,0,0,0.1)',
        zIndex: 2
      }}>
        <h1 style={{ fontSize: '1.4rem', marginBottom: '1rem', textAlign: window.innerWidth < 768 ? 'center' : 'left' }}>
          🔐 Iniciar sesión
        </h1>

        <div style={{ display: 'grid', gap: '0.65rem' }}>
          <input
            type="email"
            placeholder="📧 Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: '0.65rem',
              borderRadius: '6px',
              border: '1px solid #ccc',
              fontSize: '0.95rem',
              transition: 'border 0.2s ease',
            }}
            onFocus={(e) => e.target.style.border = '1px solid #00BFFF'}
            onBlur={(e) => e.target.style.border = '1px solid #ccc'}
          />
          <input
            type="text"
            placeholder="🔢 Número de cuenta"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            style={{
              padding: '0.65rem',
              borderRadius: '6px',
              border: '1px solid #ccc',
              fontSize: '0.95rem',
              transition: 'border 0.2s ease',
            }}
            onFocus={(e) => e.target.style.border = '1px solid #00BFFF'}
            onBlur={(e) => e.target.style.border = '1px solid #ccc'}
          />
          <input
            type="text"
            value={address}
            readOnly
            style={{
              padding: '0.65rem',
              borderRadius: '6px',
              border: '1px solid #eee',
              background: '#f0f0f0',
              fontSize: '0.95rem',
              color: '#666'
            }}
          />
          <button 
            onClick={(e) => {
              handleLogin()
              e.currentTarget.style.transform = 'scale(0.95)'
              setTimeout(() => {
                e.currentTarget.style.transform = 'scale(1)'
              }, 150)
            }}
            style={{
              padding: '0.75rem',
              backgroundColor: '#00BFFF',
              color: '#fff',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.95rem',
              cursor: 'pointer',
              transition: 'background 0.2s ease, transform 0.2s ease'
            }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = '#009ACD'}
            onMouseOut={e => e.currentTarget.style.backgroundColor = '#00BFFF'}
          >
            Iniciar sesión
          </button>
          <p style={{ fontSize: '0.8rem', color: '#999', textAlign: 'center', marginTop: '0.5rem' }}>
            Tus datos están seguros en este dispositivo.
          </p>
        </div>
      </div>

      {/* Derecha: imagen decorativa */}
      <div style={{ 
        flex: 1,
        backgroundImage: 'url("/images/login-visual.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: window.innerWidth < 768 ? 'none' : 'block' // 🔹 Ocultar imagen en móviles
      }} />
    </div>
  )
}
