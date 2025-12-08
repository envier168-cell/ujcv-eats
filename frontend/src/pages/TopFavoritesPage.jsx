import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { fetchTopFavorites } from '../api'

export default function TopFavoritesPage() {
  const [favorites, setFavorites] = useState([])
  const [status, setStatus] = useState('Cargando...')
  const [isMobile, setIsMobile] = useState(false)
  const navigate = useNavigate()

  // Detectar tamaño de pantalla
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Colores para las posiciones
  const positionColors = {
    1: '#FFD700', // Oro
    2: '#C0C0C0', // Plata
    3: '#CD7F32', // Bronce
    default: '#4f46e5' // Azul para otros
  }

  // Iconos para cada posición
  const positionIcons = {
    1: '🥇',
    2: '🥈',
    3: '🥉',
    default: '⭐'
  }

  useEffect(() => {
    setStatus('Cargando...')
    fetchTopFavorites()
      .then(data => {
        setFavorites(data)
        setStatus('OK')
      })
      .catch(err => {
        console.error('Error cargando favoritos:', err)
        // Datos de ejemplo si falla la API
        const mockFavorites = [
          { id: 1, name: "Whopper", count: 342, restaurant: "Burger King" },
          { id: 2, name: "Big Mac", count: 298, restaurant: "McDonald's" },
          { id: 3, name: "Pizza Pepperoni", count: 256, restaurant: "Pizza Hut" },
          { id: 4, name: "Sub Club", count: 187, restaurant: "Subway" },
          { id: 5, name: "Bucket de Pollo", count: 165, restaurant: "KFC" },
          { id: 6, name: "Cheeseburger", count: 142, restaurant: "Burger King" },
          { id: 7, name: "Alitas BBQ", count: 128, restaurant: "Pizza Hut" },
          { id: 8, name: "McNuggets", count: 115, restaurant: "McDonald's" },
          { id: 9, name: "Italian B.M.T.", count: 98, restaurant: "Subway" },
          { id: 10, name: "Twister", count: 87, restaurant: "KFC" }
        ]
        setFavorites(mockFavorites)
        setStatus('Datos de ejemplo')
      })
  }, [])

  const getPositionColor = (index) => {
    return positionColors[index + 1] || positionColors.default
  }

  const getPositionIcon = (index) => {
    return positionIcons[index + 1] || positionIcons.default
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      paddingBottom: '2rem'
    }}>
      {/* HEADER CON GRADIENTE NARANJA/ROJO (TEMA DE FUEGO) */}
      <div style={{
        background: 'linear-gradient(135deg, #FF6B35 0%, #FF0000 100%)',
        color: 'white',
        padding: isMobile ? '1rem' : '1.5rem 2rem',
        borderRadius: '0 0 20px 20px',
        boxShadow: '0 4px 20px rgba(255, 107, 53, 0.3)',
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
              <span style={{ fontSize: '1.8rem' }}>🔥</span>
              Top Favoritos de la Semana
            </h1>
            <p style={{ 
              margin: '0.25rem 0 0',
              opacity: 0.9,
              fontSize: isMobile ? '0.9rem' : '1rem'
            }}>
              Los productos más pedidos esta semana
            </p>
          </div>
          
          {/* Botón de volver */}
          <Link 
            to="/" 
            style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              padding: '0.75rem 1.25rem',
              borderRadius: '50px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.3)'
              e.currentTarget.style.transform = 'translateX(-3px)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.2)'
              e.currentTarget.style.transform = 'translateX(0)'
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>←</span>
            {!isMobile && 'Volver'}
          </Link>
        </div>

        {/* ESTADÍSTICAS RÁPIDAS */}
        <div style={{
          maxWidth: '1200px',
          margin: '2rem auto 0',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: '1rem'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            padding: '1.25rem',
            borderRadius: '16px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📈</div>
            <div style={{ 
              fontWeight: 'bold',
              fontSize: isMobile ? '1.1rem' : '1.25rem'
            }}>
              {favorites.length} Productos
            </div>
            <div style={{ 
              fontSize: '0.9rem',
              opacity: 0.9
            }}>
              En el ranking
            </div>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            padding: '1.25rem',
            borderRadius: '16px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚡</div>
            <div style={{ 
              fontWeight: 'bold',
              fontSize: isMobile ? '1.1rem' : '1.25rem'
            }}>
              {favorites[0]?.count || 0} Pedidos
            </div>
            <div style={{ 
              fontSize: '0.9rem',
              opacity: 0.9
            }}>
              Del producto #1
            </div>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            padding: '1.25rem',
            borderRadius: '16px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏆</div>
            <div style={{ 
              fontWeight: 'bold',
              fontSize: isMobile ? '1.1rem' : '1.25rem'
            }}>
              {favorites.reduce((sum, item) => sum + (item.count || 0), 0)}
            </div>
            <div style={{ 
              fontSize: '0.9rem',
              opacity: 0.9
            }}>
              Pedidos totales
            </div>
          </div>
        </div>
      </div>

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
              background: status === 'OK' || status === 'Datos de ejemplo' ? '#10b981' : '#ef4444',
              animation: (status === 'OK' || status === 'Datos de ejemplo') ? 'pulse 2s infinite' : 'none'
            }} />
            <span style={{ 
              fontWeight: '500',
              color: (status === 'OK' || status === 'Datos de ejemplo') ? '#059669' : '#dc2626'
            }}>
              {status === 'OK' ? '✅ Datos en vivo' : 
               status === 'Datos de ejemplo' ? '⚠️ Usando datos de ejemplo' : 
               '⚠️ ' + status}
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
              Actualizado hoy
            </span>
          </div>
        </div>

        {/* LISTA DE FAVORITOS */}
        {favorites.length === 0 ? (
          <div style={{ 
            background: 'white',
            borderRadius: '16px',
            padding: '3rem 2rem',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
          }}>
            <div style={{ 
              fontSize: '3rem', 
              marginBottom: '1rem', 
              opacity: 0.5,
              animation: 'pulse 2s infinite'
            }}>
              📊
            </div>
            <p style={{ 
              color: '#6b7280',
              fontSize: '1.1rem',
              marginBottom: '1.5rem'
            }}>
              No hay productos destacados esta semana.
            </p>
            <button 
              onClick={() => navigate('/')}
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
              Ver restaurantes
            </button>
          </div>
        ) : (
          <div style={{ 
            display: 'grid',
            gap: isMobile ? '0.75rem' : '1rem'
          }}>
            {favorites.map((item, index) => {
              const positionColor = getPositionColor(index)
              const positionIcon = getPositionIcon(index)
              
              return (
                <div 
                  key={item.id || index}
                  style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: isMobile ? '1rem' : '1.25rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    borderLeft: `4px solid ${positionColor}`
                  }}
                  onMouseOver={(e) => {
                    if (!isMobile) {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = `0 6px 20px ${positionColor}30, 0 4px 12px rgba(0,0,0,0.1)`
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isMobile) {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'
                    }
                  }}
                >
                  {/* NÚMERO DE POSICIÓN */}
                  <div style={{
                    position: 'absolute',
                    top: '0.5rem',
                    left: '0.5rem',
                    width: isMobile ? '28px' : '32px',
                    height: isMobile ? '28px' : '32px',
                    background: positionColor,
                    color: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: isMobile ? '0.9rem' : '1rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}>
                    {index + 1}
                  </div>

                  {/* CONTENIDO */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem'
                  }}>
                    <div style={{ 
                      flex: 1,
                      marginLeft: isMobile ? '40px' : '45px'
                    }}>
                      <h2 style={{ 
                        margin: 0,
                        fontSize: isMobile ? '1.1rem' : '1.25rem',
                        fontWeight: '600',
                        color: '#1f2937',
                        marginBottom: '0.25rem'
                      }}>
                        {item.name}
                      </h2>
                      
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        flexWrap: 'wrap',
                        marginBottom: '0.5rem'
                      }}>
                        <span style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          background: '#f3f4f6',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '20px',
                          fontSize: '0.85rem',
                          color: '#6b7280'
                        }}>
                          <span>🏢</span>
                          {item.restaurant || 'Restaurante'}
                        </span>
                        
                        <span style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          fontSize: '0.85rem',
                          color: '#6b7280'
                        }}>
                          <span style={{ color: positionColor }}>🔥</span>
                          <span style={{ fontWeight: '500' }}>{item.count || 0}</span> pedidos
                        </span>
                      </div>
                      
                      {/* BARRA DE PROGRESO */}
                      <div style={{
                        width: '100%',
                        height: '8px',
                        background: '#f3f4f6',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        marginTop: '0.5rem'
                      }}>
                        <div 
                          style={{
                            width: `${Math.min(100, (item.count / (favorites[0]?.count || 1)) * 100)}%`,
                            height: '100%',
                            background: `linear-gradient(90deg, ${positionColor}, ${adjustColor(positionColor, 30)})`,
                            borderRadius: '4px',
                            transition: 'width 0.5s ease'
                          }}
                        />
                      </div>
                    </div>

                    {/* ÍCONO DE POSICIÓN */}
                    <div style={{
                      fontSize: isMobile ? '2rem' : '2.5rem',
                      opacity: 0.8
                    }}>
                      {positionIcon}
                    </div>
                  </div>

                  {/* BADGE DE TENDENCIA */}
                  {index < 3 && (
                    <div style={{
                      position: 'absolute',
                      top: '0.5rem',
                      right: '0.5rem',
                      background: positionColor,
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                    }}>
                      {index === 0 ? 'TOP SELLER' : index === 1 ? 'TENDENCIA' : 'POPULAR'}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* INFORMACIÓN ADICIONAL */}
        {favorites.length > 0 && (
          <div style={{
            marginTop: '2rem',
            background: 'white',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{ 
              margin: '0 0 1rem',
              fontSize: '1.1rem',
              fontWeight: '600',
              color: '#1f2937',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              📊 Información del ranking
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
              gap: '1rem'
            }}>
              <div style={{
                padding: '0.75rem',
                background: '#f9fafb',
                borderRadius: '8px'
              }}>
                <div style={{ 
                  fontSize: '0.85rem',
                  color: '#6b7280',
                  marginBottom: '0.25rem'
                }}>
                  Período
                </div>
                <div style={{ 
                  fontWeight: '600',
                  color: '#1f2937'
                }}>
                  Esta semana
                </div>
              </div>
              <div style={{
                padding: '0.75rem',
                background: '#f9fafb',
                borderRadius: '8px'
              }}>
                <div style={{ 
                  fontSize: '0.85rem',
                  color: '#6b7280',
                  marginBottom: '0.25rem'
                }}>
                  Restaurantes
                </div>
                <div style={{ 
                  fontWeight: '600',
                  color: '#1f2937'
                }}>
                  {[...new Set(favorites.map(f => f.restaurant))].length} diferentes
                </div>
              </div>
              <div style={{
                padding: '0.75rem',
                background: '#f9fafb',
                borderRadius: '8px'
              }}>
                <div style={{ 
                  fontSize: '0.85rem',
                  color: '#6b7280',
                  marginBottom: '0.25rem'
                }}>
                  Siguiente actualización
                </div>
                <div style={{ 
                  fontWeight: '600',
                  color: '#1f2937'
                }}>
                  Cada lunes
                </div>
              </div>
            </div>
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
            © {new Date().getFullYear()} UJCV Eats — Ranking de favoritos
          </p>
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', opacity: 0.7 }}>
            Actualizado automáticamente | Basado en pedidos reales
          </p>
        </div>
      </div>

      {/* ESTILOS DE ANIMACIÓN EN LÍNEA */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
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