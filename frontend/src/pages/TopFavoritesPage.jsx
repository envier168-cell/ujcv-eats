import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchTopFavorites } from '../api'  // ✅ Importa la función correcta

export default function TopFavoritesPage() {
  const [favorites, setFavorites] = useState([])
  const [status, setStatus] = useState('Cargando...')

  useEffect(() => {
    setStatus('Cargando...')
    fetchTopFavorites()
      .then(data => {
        setFavorites(data)
        setStatus('OK')
      })
      .catch(err => {
        console.error('Error cargando favoritos:', err)
        setFavorites([])
        setStatus('Sin datos del backend')
      })
  }, [])

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '1rem' }}>
      <h1>🔥 Más pedido esta semana</h1>

      <Link to="/" className="link">
        ← Volver al menú principal
      </Link>

      <p style={{ color: '#666', margin: '0.75rem 0' }}>
        Estado de datos: {status}
      </p>

      {favorites.length === 0 ? (
        <p style={{ color: '#666' }}>No hay productos destacados esta semana.</p>
      ) : (
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {favorites.map((item, i) => (
            <div key={i} className="card-favorite">
              <div>
                <h2>{item.name}</h2>
                <p>Pedidos: {item.count}</p>
              </div>
              <span>⭐</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
