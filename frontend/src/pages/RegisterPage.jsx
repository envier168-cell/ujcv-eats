import { useState } from 'react'
import { useToast } from '../context/ToastProvider'
import { useAuth } from '../context/AuthContext'

function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [address] = useState('Dirección automática de ejemplo')
  const { show } = useToast()
  const { login } = useAuth()

  const handleRegister = () => {
    if (!name || !email || !accountNumber) {
      show('⚠️ Completa todos los campos antes de registrarte', 'error', 4000)
      return
    }

    const userData = {
      name,
      email,
      accountNumber,
      address
    }

    login(userData)
    show('✅ Registro completado', 'success', 3000)
  }

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: '1rem' }}>
      <h1>📝 Registro de usuario</h1>
      <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1rem' }}>
        <input
          type="text"
          placeholder="Nombre completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Número de cuenta"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
        />
        <input
          type="text"
          value={address}
          readOnly
          style={{ background: '#f9f9f9' }}
        />
        <button onClick={handleRegister}>Registrarse</button>
      </div>
    </div>
  )
}

export default RegisterPage
