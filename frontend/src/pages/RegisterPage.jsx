import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../context/ToastProvider'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [address, setAddress] = useState('Dirección automática de ejemplo')
  const navigate = useNavigate()
  const { show } = useToast()

  const handleRegister = () => {
    // 🔹 Guardar datos en localStorage aunque estén vacíos
    localStorage.setItem('userInfo', JSON.stringify({
      name: name || 'Usuario de ejemplo',
      email: email || 'correo@ejemplo.com',
      accountNumber: accountNumber || '0000000000',
      address
    }))

    // ✅ Toast de confirmación
    show('✅ Registro de ejemplo completado', 'success', 3000)

    // ✅ Toast de aviso de proyecto de ejemplo
    show('⚠️ Este es un proyecto de ejemplo. Los datos no son reales ni se validan.', 'info', 5000)

    navigate('/') // Redirige al menú principal
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
