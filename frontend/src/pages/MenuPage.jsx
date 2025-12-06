import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useToast } from '../context/useToast'
import { fetchMenu, fetchRestaurantById } from '../api'

export default function MenuPage() {
  const { id } = useParams()
  const [menu, setMenu] = useState([])
  const [restaurant, setRestaurant] = useState(null)
  const { show } = useToast()

  useEffect(() => {
    let mounted = true

    fetchMenu(id)
      .then(data => { if (mounted) setMenu(data) })
      .catch(() => { if (mounted) setMenu([]) })

    fetchRestaurantById(id)
      .then(data => { if (mounted) setRestaurant(data) })
      .catch(() => { if (mounted) setRestaurant(null) })

    return () => { mounted = false }
  }, [id])

  const addToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem('cartItems') || '[]')
    const newCart = [...cart, item]
    localStorage.setItem('cartItems', JSON.stringify(newCart))

    if (restaurant) {
      localStorage.setItem('selectedRestaurant', JSON.stringify(restaurant))
    }

    show(`✅ ${item.name} añadido al carrito`, 'success', 2500)
  }

  return (
    <div 
      className={`restaurant-theme restaurant-${restaurant?.name?.toLowerCase() || ''}`} 
      style={{ maxWidth: 900, margin: '0 auto', padding: '1rem' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>{restaurant ? restaurant.name : 'Cargando restaurante...'}</h1>
          <Link to="/" className="link">← Volver a restaurantes</Link>
        </div>
        <Link to="/checkout" className="button">
          🛒 Ir al carrito
        </Link>
      </div>

      <div style={{ marginTop: '1rem', display: 'grid', gap: '1rem' }}>
        {menu.length === 0 ? (
          <p style={{ color: '#666' }}>No hay productos disponibles en este restaurante.</p>
        ) : (
          menu.map(item => (
            <div 
              key={item.id} 
              className="card"
              style={{ 
                display: 'flex', 
                gap: '1.5rem', 
                alignItems: 'stretch',
                padding: '1.5rem', 
                border: '1px solid #eee', 
                borderRadius: '12px',
                backgroundColor: '#fff',
                flexDirection: window.innerWidth < 768 ? 'column' : 'row-reverse' // 🔹 imagen a la derecha en desktop
              }}
            >
              {/* Imagen del platillo */}
              {item.image && (
                <img 
                  src={item.image} 
                  alt={item.name} 
                  style={{ 
                    width: window.innerWidth < 768 ? '100%' : '180px',
                    height: window.innerWidth < 768 ? 'auto' : '180px',
                    objectFit: 'contain', // 🔹 muestra la imagen completa
                    borderRadius: '8px',
                    flexShrink: 0,
                    transition: 'transform 0.3s ease',
                    border: '2px solid #f0f0f0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                  onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                />
              )}

              {/* Información del platillo */}
              <div style={{ 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                fontSize: '1rem',
                lineHeight: '1.5'
              }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.25rem' }}>{item.name}</h2>
                  <p style={{ marginTop: '0.5rem', color: '#666' }}>{item.description}</p>
                  <p style={{ marginTop: '0.25rem' }}><strong>Lps {item.price.toFixed(2)}</strong></p>
                </div>

                <button 
                  onClick={() => addToCart(item)} 
                  className="button-add"
                  style={{ 
                    marginTop: '1rem',
                    padding: '0.6rem 1.2rem',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontWeight: 'bold'
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.backgroundColor = '#0056b3'
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)'
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.backgroundColor = '#007bff'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>➕</span>
                  <span style={{ marginLeft: '0.5rem' }}>Añadir al carrito</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
