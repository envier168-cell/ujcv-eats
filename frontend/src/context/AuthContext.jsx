import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  // 🔹 Al iniciar la app, intenta restaurar sesión desde localStorage
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('userInfo'))
      if (stored && typeof stored === 'object') {
        setUser(stored)
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    }
  }, [])

  // 🔹 Iniciar sesión: guarda en localStorage y actualiza estado
  const login = (data) => {
    localStorage.setItem('userInfo', JSON.stringify(data))
    setUser(data)
    navigate('/')
  }

  // 🔹 Cerrar sesión: limpia localStorage y estado
  const logout = () => {
    localStorage.removeItem('userInfo')
    setUser(null)
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
