import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../context/ToastProvider'

export default function UserInfoPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [address, setAddress] = useState('')
  const navigate = useNavigate()
  const { show } = useToast()

  const handleLogin = () => {
    if (!name || !email || !accountNumber || !address) {
      show('⚠️ Completa todos los campos', 'info', 2500)
      return
    }

    localStorage.setItem('userInfo', JSON.stringify({
      name,
      email,
      accountNumber,
      address
    }))

    show(`✅ Bienvenido ${name}`, 'success', 3000)
    navigate('/')
  }

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: '1rem' }}>
      <h1>🔐 Iniciar sesión</h1>

      <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1rem' }}>
        <input
          type="text"
          placeholder="Nombre completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field"
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
        />
        <input
          type="text"
          placeholder="Número de cuenta"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          className="input-field"
        />
        <input
          type="text"
          placeholder="Dirección"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="input-field"
        />
        <button onClick={handleLogin} className="button-login">
          Iniciar sesión
        </button>
      </div>
    </div>
  )
}
