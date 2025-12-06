import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import UserDropdown from '../components/UserDropdown'
import { fetchRestaurants } from '../api'

export default function HomePage() {
  const [restaurants, setRestaurants] = useState([])
  const [status, setStatus] = useState('Cargando...')
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  const imageMap = {
    "burger king comayagua": "/images/burgerking.png",
    "mcdonald's comayagua": "/images/mcdonalds.png",
    "pizza hut comayagua": "/images/pizzahut.png",
    "subway comayagua": "/images/subway.png",
    "kfc comayagua": "/images/kfc.png"
  }

  useEffect(() => {
    setStatus('Cargando...')
    fetchRestaurants()
      .then(data => {
        setRestaurants(data)
        setStatus('OK')
      })
      .catch(err => {
        console.error('Error cargando restaurantes:', err)
        setRestaurants([])
        setStatus('Sin datos del backend')
      })

    const storedUser = JSON.parse(localStorage.getItem('userInfo') || '{}')
    setUser(storedUser)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('userInfo')
    setUser(null)
    navigate('/usuario')
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '1rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>UJCV Eats — Comayagua</h1>
        <UserDropdown user={user} onLogout={handleLogout} />
      </header>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <Link to="/top"      className="quick-button quick-top">🔥</Link>
        <Link to="/tracking" className="quick-button quick-tracking">🍽️</Link>
        <Link to="/checkout" className="quick-button quick-checkout">🛒</Link>
        <Link to="/orders"   className="quick-button quick-orders">📜</Link>
      </div>

      <p style={{ color: '#666', marginBottom: '0.75rem' }}>
        Estado de datos: {status}
      </p>

      {restaurants.length === 0 ? (
        <p style={{ color: '#666' }}>No hay restaurantes disponibles.</p>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {restaurants.map(r => {
            const nameKey = r.name.toLowerCase()
            const imageUrl = imageMap[nameKey] || '/images/default.png'

            return (
              <div 
                key={r.id} 
                className={`card restaurant-theme restaurant-${nameKey}`}
                style={{
                  display: 'flex',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  backgroundColor: '#f9f9f9' // 🔹 gris claro por defecto
                }}
                onMouseOver={e => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
                  e.currentTarget.style.backgroundColor = '#eaeaea' // 🔹 gris más oscuro al hover
                }}
                onMouseOut={e => {
                  e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)'
                  e.currentTarget.style.backgroundColor = '#f9f9f9'
                }}
              >
                {/* Mitad izquierda */}
                <div style={{ 
                  flex: 1, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between' 
                }}>
                  <div style={{ padding: '1rem' }}>
                    <h2>{r.name}</h2>
                    <p style={{ marginTop: '0.25rem', color: '#666' }}>{r.address}</p>
                  </div>
                  <Link 
                    to={`/menu/${r.id}`} 
                    style={{
                      width: '100%',
                      padding: '0.85rem',
                      backgroundColor: '#00BFFF',
                      color: '#fff',
                      textAlign: 'center',
                      border: 'none',
                      borderRadius: '0',
                      fontWeight: 'bold',
                      textDecoration: 'none',
                      transition: 'background 0.2s ease, transform 0.2s ease'
                    }}
                    onMouseOver={e => e.currentTarget.style.backgroundColor = '#009ACD'}
                    onMouseOut={e => e.currentTarget.style.backgroundColor = '#00BFFF'}
                    onClick={e => {
                      e.currentTarget.style.transform = 'scale(0.95)'
                      setTimeout(() => {
                        e.currentTarget.style.transform = 'scale(1)'
                      }, 150)
                    }}
                  >
                    Ver menú
                  </Link>
                </div>

                {/* Mitad derecha con refinamiento visual */}
                <div 
                  style={{ 
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#fff'
                  }}
                >
                  <img 
                    src={imageUrl} 
                    alt={r.name} 
                    style={{
                      maxHeight: '120px',
                      width: 'auto',
                      objectFit: 'contain',
                      padding: '0.5rem',
                      borderRadius: '8px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                      transition: 'transform 0.3s ease'
                    }}
                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1.0)'}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
