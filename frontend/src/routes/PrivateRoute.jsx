import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function PrivateRoute({ children }) {
  const { user } = useAuth()

  // 🔹 Si no hay usuario, redirige al login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // 🔹 Si hay usuario, renderiza la ruta protegida
  return children
}
