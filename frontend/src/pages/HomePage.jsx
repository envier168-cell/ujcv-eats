import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import UserDropdown from '../components/UserDropdown'
import { fetchRestaurants } from '../api'

export default function HomePage() {
  const [restaurants, setRestaurants] = useState([])
  const [status, setStatus] = useState('Cargando...')
  const [user, setUser] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const navigate = useNavigate()

  // Detectar tamaño de pantalla
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // TUS IMÁGENES ASIGNADAS
  const imageMap = {
    "burger king comayagua": "/images/burgerking.png",
    "mcdonald's comayagua": "/images/mcdonalds.png",
    "pizza hut comayagua": "/images/pizzahut.png",
    "subway comayagua": "/images/subway.png",
    "kfc comayagua": "/images/kfc.png"
  }

  // Banners para cada restaurante (usando las mismas imágenes de MenuPage)
  const bannerImages = {
    "burger king comayagua": "https://conexion360.mx/wp-content/uploads/2021/02/FOTO-WEB-BUGER-KING.jpg",
    "mcdonald's comayagua": "https://wallpapercave.com/wp/wp11260474.png",
    "pizza hut comayagua": "https://logo-marque.com/wp-content/uploads/2021/10/Pizza-Hut-Logo-2010-2014.jpg",
    "subway comayagua": "https://tse3.mm.bing.net/th/id/OIP.noHXoXpS7C2nlSosSG7nMAHaCI?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3",
    "kfc comayagua": "https://th.bing.com/th/id/R.15c78fa20effbc6889920927badccf9f?rik=3dhJtSGcfHRHig&riu=http%3a%2f%2fkfcshop.ca%2fcdn%2fshop%2ffiles%2fkfc-social-image.jpg%3fv%3d1692971149&ehk=OFG3JJHgmDBqNEUUudeD6Hfp0aaY4IKLKCbHrj9n8Mg%3d&risl=&pid=ImgRaw&r=0",
    "default": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=400&fit=crop"
  }

  // Colores de marca para cada restaurante
  const brandColors = {
    "burger king comayagua": "#FF6B35",
    "mcdonald's comayagua": "#FFBC0D",
    "pizza hut comayagua": "#FF0000",
    "subway comayagua": "#009F49",
    "kfc comayagua": "#E31837",
    "default": "#4f46e5"
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
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      paddingBottom: '2rem'
    }}>
      {/* HEADER MODERNO */}
      <header style={{
        background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
        color: 'white',
        padding: isMobile ? '1rem' : '1.5rem 2rem',
        borderRadius: '0 0 20px 20px',
        boxShadow: '0 4px 20px rgba(79, 70, 229, 0.3)',
        marginBottom: '2rem'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h1 style={{ 
              margin: 0, 
              fontSize: isMobile ? '1.5rem' : '1.8rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span style={{ fontSize: '1.8rem' }}>🍔</span>
              UJCV Eats — Comayagua
            </h1>
            <p style={{ 
              margin: '0.25rem 0 0',
              opacity: 0.9,
              fontSize: isMobile ? '0.9rem' : '1rem'
            }}>
              Pedidos de comida rápida a domicilio
            </p>
          </div>
          
          <UserDropdown user={user} onLogout={handleLogout} />
        </div>

        {/* ACCESOS RÁPIDOS MEJORADOS */}
        <div style={{
          maxWidth: '1200px',
          margin: '2rem auto 0',
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: '1rem'
        }}>
          <Link 
            to="/top" 
            style={{
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              padding: '1.25rem',
              borderRadius: '16px',
              textDecoration: 'none',
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.25)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.15)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <span style={{ fontSize: '2rem' }}>🔥</span>
            <span style={{ 
              fontWeight: '600',
              fontSize: isMobile ? '0.9rem' : '1rem'
            }}>
              Top Favoritos
            </span>
          </Link>

          <Link 
            to="/tracking" 
            style={{
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              padding: '1.25rem',
              borderRadius: '16px',
              textDecoration: 'none',
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.25)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.15)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <span style={{ fontSize: '2rem' }}>🍽️</span>
            <span style={{ 
              fontWeight: '600',
              fontSize: isMobile ? '0.9rem' : '1rem'
            }}>
              Seguimiento
            </span>
          </Link>

          <Link 
            to="/checkout" 
            style={{
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              padding: '1.25rem',
              borderRadius: '16px',
              textDecoration: 'none',
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.25)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.15)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <span style={{ fontSize: '2rem' }}>🛒</span>
            <span style={{ 
              fontWeight: '600',
              fontSize: isMobile ? '0.9rem' : '1rem'
            }}>
              Carrito
            </span>
          </Link>

          <Link 
            to="/orders" 
            style={{
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              padding: '1.25rem',
              borderRadius: '16px',
              textDecoration: 'none',
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.25)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.15)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <span style={{ fontSize: '2rem' }}>📜</span>
            <span style={{ 
              fontWeight: '600',
              fontSize: isMobile ? '0.9rem' : '1rem'
            }}>
              Mis Pedidos
            </span>
          </Link>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <div style={{ 
        maxWidth: '1200px',
        margin: '0 auto',
        padding: isMobile ? '0 1rem' : '0 2rem'
      }}>
        {/* ESTADO DE CONEXIÓN */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1rem 1.5rem',
          marginBottom: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: status === 'OK' ? '#10b981' : '#ef4444',
              animation: status === 'OK' ? 'pulse 2s infinite' : 'none'
            }} />
            <span style={{ 
              fontWeight: '500',
              color: status === 'OK' ? '#059669' : '#dc2626'
            }}>
              {status === 'OK' ? '✅ Conectado al servidor' : '⚠️ ' + status}
            </span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ 
              background: '#f3f4f6',
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.85rem',
              color: '#6b7280'
            }}>
              {restaurants.length} restaurantes disponibles
            </span>
          </div>
        </div>

        {/* LISTA DE RESTAURANTES */}
        {restaurants.length === 0 ? (
          <div style={{ 
            background: 'white',
            borderRadius: '16px',
            padding: '3rem 2rem',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>🍴</div>
            <p style={{ 
              color: '#6b7280',
              fontSize: '1.1rem',
              marginBottom: '1.5rem'
            }}>
              No hay restaurantes disponibles en este momento.
            </p>
            <button 
              onClick={() => window.location.reload()}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#4f46e5',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#4338ca'
                e.currentTarget.style.transform = 'scale(1.02)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#4f46e5'
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              Reintentar
            </button>
          </div>
        ) : (
          <div style={{ 
            display: 'grid',
            gap: isMobile ? '1rem' : '1.5rem'
          }}>
            {restaurants.map(r => {
              const nameKey = r.name.toLowerCase()
              const logoImage = imageMap[nameKey] || '/images/default.png'
              const bannerImage = bannerImages[nameKey] || bannerImages.default
              const brandColor = brandColors[nameKey] || brandColors.default

              return (
                <div 
                  key={r.id} 
                  className={`restaurant-theme restaurant-${nameKey}`}
                  style={{
                    background: 'white',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    transition: 'all 0.4s ease',
                    position: 'relative'
                  }}
                  onMouseOver={(e) => {
                    if (!isMobile) {
                      e.currentTarget.style.transform = 'translateY(-4px)'
                      e.currentTarget.style.boxShadow = `0 8px 30px ${brandColor}20, 0 4px 20px rgba(0,0,0,0.12)`
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isMobile) {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'
                    }
                  }}
                >
                  {/* BANNER CON LA MISMA IMAGEN QUE MENUPAGE */}
                  <div style={{
                    position: 'relative',
                    height: '120px',
                    width: '100%',
                    overflow: 'hidden'
                  }}>
                    <img 
                      src={bannerImage}
                      alt={`Banner de ${r.name}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `linear-gradient(to bottom, transparent 0%, ${brandColor}40 100%)`
                    }} />
                    
                    {/* TU LOGO ORIGINAL EN EL BANNER */}
                    <div style={{
                      position: 'absolute',
                      bottom: '-25px',
                      left: '1.5rem',
                      width: '80px',
                      height: '80px',
                      backgroundColor: 'white',
                      borderRadius: '16px',
                      padding: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      border: `3px solid ${brandColor}`
                    }}>
                      <img 
                        src={logoImage}
                        alt={r.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    </div>
                  </div>

                  {/* CONTENIDO DE LA TARJETA */}
                  <div style={{ 
                    padding: '1.5rem',
                    paddingTop: '2.5rem'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '1rem'
                    }}>
                      <div style={{ flex: 1 }}>
                        <h2 style={{ 
                          margin: 0,
                          fontSize: '1.25rem',
                          fontWeight: 'bold',
                          color: '#1f2937'
                        }}>
                          {r.name}
                        </h2>
                        <p style={{ 
                          margin: '0.25rem 0 0',
                          color: '#6b7280',
                          fontSize: '0.95rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          <span>📍</span> {r.address}
                        </p>
                      </div>
                      
                      {/* RATING */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        background: '#f3f4f6',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '20px'
                      }}>
                        <span style={{ color: '#f59e0b' }}>⭐</span>
                        <span style={{ 
                          fontWeight: '600',
                          fontSize: '0.9rem',
                          color: '#374151'
                        }}>
                          4.5
                        </span>
                      </div>
                    </div>

                    {/* INFO ADICIONAL */}
                    <div style={{
                      display: 'flex',
                      gap: '1rem',
                      marginBottom: '1.5rem',
                      flexWrap: 'wrap'
                    }}>
                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.85rem',
                        color: '#6b7280'
                      }}>
                        <span>⏱️</span> 20-30 min
                      </span>
                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.85rem',
                        color: '#6b7280'
                      }}>
                        <span>💰</span> Desde L. 50
                      </span>
                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.85rem',
                        color: '#6b7280'
                      }}>
                        <span>🚗</span> Gratis
                      </span>
                    </div>

                    {/* BOTÓN VER MENÚ */}
                    <Link 
                      to={`/menu/${r.id}`}
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: '0.85rem',
                        background: brandColor,
                        color: 'white',
                        textAlign: 'center',
                        borderRadius: '12px',
                        textDecoration: 'none',
                        fontWeight: '600',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                      onMouseOver={(e) => {
                        if (!isMobile) {
                          e.currentTarget.style.background = adjustColor(brandColor, -20)
                          e.currentTarget.style.transform = 'scale(1.02)'
                        }
                      }}
                      onMouseOut={(e) => {
                        if (!isMobile) {
                          e.currentTarget.style.background = brandColor
                          e.currentTarget.style.transform = 'scale(1)'
                        }
                      }}
                    >
                      Ver Menú Completo
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* FOOTER */}
        <div style={{
          marginTop: '3rem',
          textAlign: 'center',
          color: '#6b7280',
          fontSize: '0.9rem',
          padding: '1.5rem 0',
          borderTop: '1px solid #e5e7eb'
        }}>
          <p style={{ margin: 0 }}>
            © {new Date().getFullYear()} UJCV Eats — Todos los derechos reservados
          </p>
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', opacity: 0.7 }}>
            Comayagua, Honduras | Pedidos 24/7
          </p>
        </div>
      </div>

      {/* ESTILOS DE ANIMACIÓN EN LÍNEA */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
    </div>
  )
}

// Función auxiliar para ajustar colores
function adjustColor(color, amount) {
  if (color.startsWith('#')) {
    return '#' + color.replace(/^#/, '').replace(/../g, color => 
      ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2)
    )
  }
  return color
}