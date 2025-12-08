import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../context/ToastProvider'
import { useAuth } from '../context/AuthContext'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [address, setAddress] = useState('Dirección de ejemplo')
  const navigate = useNavigate()
  const { show } = useToast()
  const { login } = useAuth()

  const handleLogin = () => {
    if (!email || !accountNumber) {
      show('⚠️ Por favor ingresa correo y número de cuenta', 'error', 4000)
      return
    }

    const userData = {
      name: 'Usuario de ejemplo',
      email,
      accountNumber,
      address
    }

    login(userData)

    // ✅ Primero el mensaje de éxito (arriba)
    show('✅ Sesión iniciada', 'success', 3000)

    // ⚠️ Luego el mensaje de advertencia (debajo)
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
        flexDirection: window.innerWidth < 768 ? 'column' : 'row'
      }}
    >
      {/* Izquierda: formulario */}
      <div
        style={{
          width: window.innerWidth < 768 ? '100%' : '320px',
          padding: window.innerWidth < 768 ? '1.5rem' : '2rem 1.5rem 2rem 2rem',
          background: '#fff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          boxShadow: '0 0 12px rgba(0,0,0,0.1)',
          zIndex: 2
        }}
      >
        <h1
          style={{
            fontSize: '1.4rem',
            marginBottom: '1rem',
            textAlign: window.innerWidth < 768 ? 'center' : 'left'
          }}
        >
          🔐 Iniciar sesión
        </h1>

        <div style={{ display: 'grid', gap: '0.65rem' }}>
          <input
            type="email"
            placeholder="📧 Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="🔢 Número de cuenta"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
          />
          <input type="text" value={address} readOnly />
          <button onClick={handleLogin}>Iniciar sesión</button>
        </div>
      </div>

      {/* Derecha: imagen decorativa */}
      <div
        style={{
          flex: 1,
          backgroundImage: 'url("/images/login-visual.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          display: window.innerWidth < 768 ? 'none' : 'block'
        }}
      />
    </div>
  )
}

export default LoginPage
