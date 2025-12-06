import { useState, useEffect, useRef } from 'react'
import { CSSTransition } from 'react-transition-group'
import { useToast } from '../context/ToastProvider'
import { useNavigate } from 'react-router-dom'

export default function UserDropdown({ user }) {
  const [open, setOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(user)
  const { show } = useToast()
  const navigate = useNavigate()
  const menuRef = useRef(null)
  const nodeRef = useRef(null)   // ✅ nuevo ref para CSSTransition

  useEffect(() => {
    if (!user) {
      const stored = JSON.parse(localStorage.getItem('userInfo') || '{}')
      if (stored.name) {
        setCurrentUser(stored)
      }
    }
  }, [user])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('userInfo')
    setCurrentUser(null)
    show('👋 Sesión cerrada', 'info', 2500)
    show('⚠️ Este es un proyecto de ejemplo. Los datos no son reales ni se validan.', 'warning', 5000)
    navigate('/login')
  }

  return (
    <div style={{ position: 'relative' }} ref={menuRef}>
      <button onClick={() => setOpen(!open)} className="dropdown-button">
        👤
      </button>

      <CSSTransition
        in={open}
        timeout={250}
        classNames="dropdown"
        unmountOnExit
        nodeRef={nodeRef}   // ✅ evita findDOMNode
      >
        <div ref={nodeRef} className="dropdown-menu">
          <p><strong>{currentUser?.name ?? 'Usuario'}</strong></p>
          <p>{currentUser?.email ?? 'correo@ejemplo.com'}</p>
          <p><strong>Número de cuenta:</strong> {currentUser?.accountNumber ?? 'No disponible'}</p>
          <p><strong>Dirección:</strong> {currentUser?.address ?? 'No disponible'}</p>
          <button onClick={handleLogout} className="button-logout">
            Cerrar sesión
          </button>
        </div>
      </CSSTransition>
    </div>
  )
}
