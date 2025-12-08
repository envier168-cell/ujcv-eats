import { useState } from 'react'
import { useToast } from '../context/ToastProvider'
import { useAuth } from '../context/AuthContext'   // 🔹 Importa el contexto

export default function UserInfoPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [address, setAddress] = useState('')
  const { show } = useToast()
  const { login } = useAuth()   // 🔹 Usamos login del contexto

  const handleLogin = () => {
    if (!name || !email || !accountNumber || !address) {
      show('⚠️ Completa todos los campos', 'info', 2500)
      return
    }

    const userData = { name, email, accountNumber, address }
    login(userData)   // 🔹 Centralizado en AuthContext

    show(`✅ Bienvenido ${name}`, 'success', 3000)
  }

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: '1rem' }}>
      <h1>🔐 Iniciar sesión</h1>
      <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1rem' }}>
        <input type="text" placeholder="Nombre completo" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="text" placeholder="Número de cuenta" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
        <input type="text" placeholder="Dirección" value={address} onChange={(e) => setAddress(e.target.value)} />
        <button onClick={handleLogin}>Iniciar sesión</button>
      </div>
    </div>
  )
}
