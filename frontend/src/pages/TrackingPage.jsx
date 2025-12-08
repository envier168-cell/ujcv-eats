import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { fetchTracking } from '../api'

export default function TrackingPage() {
  const [tracking, setTracking] = useState(null)
  const [error, setError] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const [progress, setProgress] = useState(0)
  const navigate = useNavigate()

  // Detectar tamaño de pantalla
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Simular progreso animado
  useEffect(() => {
    if (tracking) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + 1
        })
      }, 100)
      
      return () => clearInterval(interval)
    }
  }, [tracking])

  useEffect(() => {
    fetchTracking(12345)
      .then(data => {
        setTracking(data)
        setError(null)
        // Iniciar progreso en 40% para simular pedido en proceso
        setProgress(40)
      })
      .catch(err => {
        console.error('Error cargando tracking:', err)
        // Datos de ejemplo si falla la API
        const mockTracking = {
          id: 12345,
          status: 'En camino',
          etaMinutes: 15,
          progress: ['👨‍🍳', '🚴', '🏠'],
          deliveryPerson: {
            name: 'Carlos Hernández',
            phone: '+504 9876-5432',
            vehicle: 'Moto Honda',
            rating: 4.8,
            deliveries: 1247
          },
          orderDetails: {
            restaurant: "Burger King Comayagua",
            items: ["Whopper", "Papas Fritas King", "Refresco"],
            total: "L. 190.00",
            address: "Colonia El Porvenir, Casa #123"
          }
        }
        setTracking(mockTracking)
        setProgress(65)
        setError(null)
      })
  }, [])

  const getStatusColor = (status) => {
    const statusMap = {
      'Preparando': '#FF9800', // Naranja
      'En camino': '#2196F3',  // Azul
      'Entregado': '#4CAF50',  // Verde
      'default': '#9C27B0'     // Púrpura
    }
    return statusMap[status] || statusMap.default
  }

  const getStatusIcon = (status) => {
    const iconMap = {
      'Preparando': '👨‍🍳',
      'En camino': '🚴',
      'Entregado': '🎉',
      'default': '📦'
    }
    return iconMap[status] || iconMap.default
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      paddingBottom: '2rem'
    }}>
      {/* HEADER CON GRADIENTE AZUL (TEMA DE SEGUIMIENTO) */}
      <div style={{
        background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
        color: 'white',
        padding: isMobile ? '1rem' : '1.5rem 2rem',
        borderRadius: '0 0 20px 20px',
        boxShadow: '0 4px 20px rgba(33, 150, 243, 0.3)',
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
              <span style={{ fontSize: '1.8rem' }}>🍽️</span>
              Seguimiento en Tiempo Real
            </h1>
            <p style={{ 
              margin: '0.25rem 0 0',
              opacity: 0.9,
              fontSize: isMobile ? '0.9rem' : '1rem'
            }}>
              Mira dónde está tu pedido en este momento
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

        {/* ESTADO RÁPIDO */}
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
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏱️</div>
            <div style={{ 
              fontWeight: 'bold',
              fontSize: isMobile ? '1.1rem' : '1.25rem'
            }}>
              {tracking?.etaMinutes || 0} min
            </div>
            <div style={{ 
              fontSize: '0.9rem',
              opacity: 0.9
            }}>
              Tiempo estimado
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
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📦</div>
            <div style={{ 
              fontWeight: 'bold',
              fontSize: isMobile ? '1.1rem' : '1.25rem'
            }}>
              #{tracking?.id || '12345'}
            </div>
            <div style={{ 
              fontSize: '0.9rem',
              opacity: 0.9
            }}>
              Número de pedido
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
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📍</div>
            <div style={{ 
              fontWeight: 'bold',
              fontSize: isMobile ? '1.1rem' : '1.25rem'
            }}>
              {tracking?.status || 'En camino'}
            </div>
            <div style={{ 
              fontSize: '0.9rem',
              opacity: 0.9
            }}>
              Estado actual
            </div>
          </div>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div style={{ 
        maxWidth: '800px',
        margin: '0 auto',
        padding: isMobile ? '0 1rem' : '0 2rem'
      }}>
        {/* BARRA DE PROGRESO AVANZADA */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          position: 'relative'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}>
            <h2 style={{ 
              margin: 0,
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#1f2937'
            }}>
              Progreso del Pedido
            </h2>
            
            {/* BADGE DE ESTADO */}
            <div style={{
              background: getStatusColor(tracking?.status || 'En camino'),
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontSize: '0.9rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span>{getStatusIcon(tracking?.status || 'En camino')}</span>
              {tracking?.status || 'En camino'}
            </div>
          </div>

          {/* PROGRESO CON EMOJIS */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            position: 'relative',
            marginBottom: '2rem'
          }}>
            {['👨‍🍳 Preparando', '🚴 En camino', '🎉 Entregado'].map((step, index) => {
              const stepProgress = index === 0 ? 33 : index === 1 ? 66 : 100
              const isActive = progress >= stepProgress
              
              return (
                <div key={index} style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  zIndex: 2
                }}>
                  <div style={{
                    width: isMobile ? '50px' : '60px',
                    height: isMobile ? '50px' : '60px',
                    borderRadius: '50%',
                    background: isActive ? getStatusColor(tracking?.status || 'En camino') : '#e5e7eb',
                    color: isActive ? 'white' : '#9ca3af',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: isMobile ? '1.5rem' : '2rem',
                    marginBottom: '0.5rem',
                    transition: 'all 0.3s ease',
                    boxShadow: isActive ? `0 4px 15px ${getStatusColor(tracking?.status || 'En camino')}40` : 'none'
                  }}>
                    {step.split(' ')[0]}
                  </div>
                  <span style={{
                    fontSize: '0.85rem',
                    fontWeight: isActive ? '600' : '400',
                    color: isActive ? '#1f2937' : '#6b7280',
                    textAlign: 'center'
                  }}>
                    {step.split(' ')[1]}
                  </span>
                </div>
              )
            })}
            
            {/* LÍNEA DE PROGRESO */}
            <div style={{
              position: 'absolute',
              top: isMobile ? '25px' : '30px',
              left: '30px',
              right: '30px',
              height: '4px',
              background: '#e5e7eb',
              zIndex: 1
            }}>
              <div style={{
                width: `${progress}%`,
                height: '100%',
                background: `linear-gradient(90deg, #2196F3, #1976D2)`,
                borderRadius: '2px',
                transition: 'width 0.5s ease',
                position: 'relative'
              }}>
                {/* PUNTO DE PROGRESO */}
                <div style={{
                  position: 'absolute',
                  right: '0',
                  top: '50%',
                  transform: 'translate(50%, -50%)',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: '#1976D2',
                  border: '3px solid white',
                  boxShadow: '0 2px 8px rgba(33, 150, 243, 0.4)'
                }} />
              </div>
            </div>
          </div>

          {/* PORCENTAJE DE PROGRESO */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '1rem'
          }}>
            <span style={{
              fontSize: '0.9rem',
              color: '#6b7280'
            }}>
              0%
            </span>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#2196F3'
              }}>
                {progress}%
              </span>
              <span style={{
                fontSize: '0.9rem',
                color: '#6b7280'
              }}>
                completado
              </span>
            </div>
            <span style={{
              fontSize: '0.9rem',
              color: '#6b7280'
            }}>
              100%
            </span>
          </div>
        </div>

        {/* INFORMACIÓN DEL PEDIDO */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {/* INFORMACIÓN DEL REPARTIDOR */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{ 
              margin: '0 0 1.5rem',
              fontSize: '1.1rem',
              fontWeight: '600',
              color: '#1f2937',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span style={{ fontSize: '1.2rem' }}>🛵</span>
              Tu Repartidor
            </h3>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1rem'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #2196F3, #1976D2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                color: 'white'
              }}>
                {tracking?.deliveryPerson?.name?.charAt(0) || 'C'}
              </div>
              
              <div>
                <div style={{
                  fontWeight: '600',
                  fontSize: '1.1rem',
                  color: '#1f2937',
                  marginBottom: '0.25rem'
                }}>
                  {tracking?.deliveryPerson?.name || 'Carlos Hernández'}
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span style={{
                    background: '#f3f4f6',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    color: '#6b7280',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    ⭐ {tracking?.deliveryPerson?.rating || '4.8'}
                  </span>
                  <span style={{
                    fontSize: '0.85rem',
                    color: '#6b7280'
                  }}>
                    {tracking?.deliveryPerson?.deliveries || '1247'} entregas
                  </span>
                </div>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gap: '0.75rem'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '0.5rem',
                borderBottom: '1px solid #f3f4f6'
              }}>
                <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>Teléfono:</span>
                <span style={{ fontWeight: '500', color: '#1f2937' }}>
                  {tracking?.deliveryPerson?.phone || '+504 9876-5432'}
                </span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '0.5rem',
                borderBottom: '1px solid #f3f4f6'
              }}>
                <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>Vehículo:</span>
                <span style={{ fontWeight: '500', color: '#1f2937' }}>
                  {tracking?.deliveryPerson?.vehicle || 'Moto Honda'}
                </span>
              </div>
              <button style={{
                marginTop: '0.5rem',
                padding: '0.75rem',
                background: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#1976D2'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#2196F3'
              }}>
                📞 Llamar al repartidor
              </button>
            </div>
          </div>

          {/* DETALLES DEL PEDIDO */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{ 
              margin: '0 0 1.5rem',
              fontSize: '1.1rem',
              fontWeight: '600',
              color: '#1f2937',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span style={{ fontSize: '1.2rem' }}>📋</span>
              Detalles del Pedido
            </h3>
            
            <div style={{
              marginBottom: '1.5rem'
            }}>
              <div style={{
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '0.5rem'
              }}>
                {tracking?.orderDetails?.restaurant || 'Burger King Comayagua'}
              </div>
              
              <div style={{
                background: '#f9fafb',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1rem'
              }}>
                {(tracking?.orderDetails?.items || ['Whopper', 'Papas Fritas King', 'Refresco']).map((item, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.5rem 0',
                    borderBottom: index < 2 ? '1px solid #e5e7eb' : 'none'
                  }}>
                    <span style={{ color: '#6b7280' }}>{item}</span>
                    <span style={{ fontWeight: '500' }}>1x</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              display: 'grid',
              gap: '0.75rem'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>Total:</span>
                <span style={{ fontWeight: '600', fontSize: '1.1rem', color: '#1f2937' }}>
                  {tracking?.orderDetails?.total || 'L. 190.00'}
                </span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '0.5rem',
                borderBottom: '1px solid #f3f4f6'
              }}>
                <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>Dirección:</span>
                <span style={{ fontWeight: '500', color: '#1f2937', textAlign: 'right' }}>
                  {tracking?.orderDetails?.address || 'Colonia El Porvenir, Casa #123'}
                </span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>Método de pago:</span>
                <span style={{ fontWeight: '500', color: '#1f2937' }}>
                  💳 Tarjeta
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* MAPA SIMULADO */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '2rem',
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
            <span style={{ fontSize: '1.2rem' }}>📍</span>
            Ubicación en Tiempo Real
          </h3>
          
          <div style={{
            height: '200px',
            background: '#f3f4f6',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* SIMULACIÓN DE MAPA */}
            <div style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(45deg, #e5e7eb 25%, transparent 25%) 0px 0px / 40px 40px, linear-gradient(-45deg, #e5e7eb 25%, transparent 25%) 0px 0px / 40px 40px, linear-gradient(45deg, transparent 75%, #e5e7eb 75%) 0px 0px / 40px 40px, linear-gradient(-45deg, transparent 75%, #e5e7eb 75%) 0px 0px / 40px 40px'
            }} />
            
            {/* RESTAURANTE */}
            <div style={{
              position: 'absolute',
              left: '20%',
              top: '50%',
              transform: 'translateY(-50%)',
              textAlign: 'center'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: '#FF6B35',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                color: 'white',
                marginBottom: '0.5rem',
                boxShadow: '0 4px 12px rgba(255, 107, 53, 0.4)'
              }}>
                🏪
              </div>
              <span style={{
                fontSize: '0.8rem',
                fontWeight: '500',
                color: '#1f2937'
              }}>
                Burger King
              </span>
            </div>
            
            {/* REPARTIDOR EN MOVIMIENTO */}
            <div style={{
              position: 'absolute',
              left: `${40 + (progress * 0.4)}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              animation: 'move 2s ease-in-out infinite'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: '#2196F3',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                color: 'white',
                marginBottom: '0.5rem',
                boxShadow: '0 4px 12px rgba(33, 150, 243, 0.4)'
              }}>
                🛵
              </div>
              <span style={{
                fontSize: '0.8rem',
                fontWeight: '500',
                color: '#1f2937',
                background: 'white',
                padding: '0.25rem 0.5rem',
                borderRadius: '12px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
              }}>
                {tracking?.deliveryPerson?.name?.split(' ')[0] || 'Carlos'}
              </span>
            </div>
            
            {/* DESTINO */}
            <div style={{
              position: 'absolute',
              right: '20%',
              top: '50%',
              transform: 'translateY(-50%)',
              textAlign: 'center'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: '#4CAF50',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                color: 'white',
                marginBottom: '0.5rem',
                boxShadow: '0 4px 12px rgba(76, 175, 80, 0.4)'
              }}>
                🏠
              </div>
              <span style={{
                fontSize: '0.8rem',
                fontWeight: '500',
                color: '#1f2937'
              }}>
                Tu ubicación
              </span>
            </div>
            
            {/* LÍNEA DE RUTA */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '20%',
              right: '20%',
              height: '3px',
              background: 'rgba(33, 150, 243, 0.2)',
              transform: 'translateY(-50%)',
              zIndex: 1
            }}>
              <div style={{
                width: `${progress}%`,
                height: '100%',
                background: '#2196F3'
              }} />
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div style={{
          textAlign: 'center',
          color: '#6b7280',
          fontSize: '0.9rem',
          padding: '1.5rem 0',
          borderTop: '1px solid #e5e7eb'
        }}>
          <p style={{ margin: 0 }}>
            © {new Date().getFullYear()} UJCV Eats — Seguimiento en tiempo real
          </p>
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', opacity: 0.7 }}>
            La ubicación se actualiza cada 30 segundos
          </p>
        </div>
      </div>

      {/* ESTILOS DE ANIMACIÓN EN LÍNEA */}
      <style>
        {`
          @keyframes move {
            0%, 100% { transform: translate(-50%, calc(-50% - 5px)); }
            50% { transform: translate(-50%, calc(-50% + 5px)); }
          }
        `}
      </style>
    </div>
  )
}