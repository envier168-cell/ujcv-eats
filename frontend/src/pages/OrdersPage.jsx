import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useToast } from '../context/useToast'
import { fetchOrders, updateOrder, deleteOrder, clearOrders } from '../api'

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState('Todos')
  const [loading, setLoading] = useState(true)
  const { show } = useToast()

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    setLoading(true)
    try {
      const data = await fetchOrders()
      setOrders(data || [])
    } catch (error) {
      console.error('Error cargando pedidos:', error)
      show('❌ Error al cargar historial de pedidos', 'error', 2500)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const repeatOrder = (order) => {
    localStorage.setItem('cartItems', JSON.stringify(order.items ?? []))
    localStorage.setItem('selectedRestaurant', JSON.stringify(order.restaurant ?? {}))
    show(`🔄 Pedido #${order.id} agregado nuevamente al carrito`, 'info', 2500)
  }

  const updateStatus = async (id, newStatus) => {
    try {
      const updated = await updateOrder(id, { status: newStatus })
      setOrders(orders.map(o => o.id === id ? updated : o))
      
      // Emoji y mensaje personalizado por estado
      const statusEmoji = {
        'Entregado': '✅',
        'Cancelado': '❌',
        'Pendiente': '⏳'
      }
      
      show(`${statusEmoji[newStatus] || '📦'} Pedido #${id} marcado como ${newStatus}`, 'success', 2500)
    } catch (err) {
      console.error(err)
      show('❌ Error al actualizar pedido', 'error', 2500)
    }
  }

  const deleteOrderHandler = async (id) => {
    if (!window.confirm(`¿Estás seguro de eliminar el pedido #${id}?`)) return
    
    try {
      await deleteOrder(id)
      setOrders(orders.filter(o => o.id !== id))
      show(`🗑️ Pedido #${id} eliminado del historial`, 'info', 2500)
    } catch (err) {
      console.error(err)
      show('❌ Error al eliminar pedido', 'error', 2500)
    }
  }

  const clearAllOrdersHandler = async () => {
    if (!window.confirm('¿Estás seguro de borrar TODO el historial de pedidos?\nEsta acción no se puede deshacer.')) return
    
    try {
      await clearOrders()
      setOrders([])
      show('🗑️ Historial de pedidos borrado completamente', 'info', 2500)
    } catch (err) {
      console.error(err)
      show('❌ Error al borrar historial', 'error', 2500)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      'Pendiente': '#f59e0b',
      'Entregado': '#10b981',
      'Cancelado': '#ef4444'
    }
    return colors[status] || '#6b7280'
  }

  const getOrderStats = () => {
    const total = orders.length
    const delivered = orders.filter(o => o.status === 'Entregado').length
    const pending = orders.filter(o => o.status === 'Pendiente').length
    const cancelled = orders.filter(o => o.status === 'Cancelado').length
    
    return { total, delivered, pending, cancelled }
  }

  const filteredOrders = filter === 'Todos'
    ? orders
    : orders.filter(order => order.status === filter)

  const stats = getOrderStats()

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      paddingBottom: '3rem'
    }}>
      {/* HEADER CON GRADIENTE PROFESIONAL */}
      <div style={{
        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
        color: 'white',
        padding: '1.5rem 2rem',
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
              fontSize: '1.8rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span style={{ fontSize: '1.8rem' }}>📋</span>
              Historial de Pedidos
            </h1>
            <p style={{ 
              margin: '0.25rem 0 0',
              opacity: 0.9,
              fontSize: '1rem'
            }}>
              Gestiona y revisa todos tus pedidos anteriores
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
            Volver al inicio
          </Link>
        </div>

        {/* ESTADÍSTICAS RÁPIDAS */}
        <div style={{
          maxWidth: '1200px',
          margin: '2rem auto 0',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
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
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📋</div>
            <div style={{ 
              fontWeight: 'bold',
              fontSize: '1.25rem'
            }}>
              {stats.total}
            </div>
            <div style={{ 
              fontSize: '0.9rem',
              opacity: 0.9
            }}>
              Total Pedidos
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
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#10b981' }}>✅</div>
            <div style={{ 
              fontWeight: 'bold',
              fontSize: '1.25rem'
            }}>
              {stats.delivered}
            </div>
            <div style={{ 
              fontSize: '0.9rem',
              opacity: 0.9
            }}>
              Entregados
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
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#f59e0b' }}>⏳</div>
            <div style={{ 
              fontWeight: 'bold',
              fontSize: '1.25rem'
            }}>
              {stats.pending}
            </div>
            <div style={{ 
              fontSize: '0.9rem',
              opacity: 0.9
            }}>
              Pendientes
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
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#ef4444' }}>❌</div>
            <div style={{ 
              fontWeight: 'bold',
              fontSize: '1.25rem'
            }}>
              {stats.cancelled}
            </div>
            <div style={{ 
              fontSize: '0.9rem',
              opacity: 0.9
            }}>
              Cancelados
            </div>
          </div>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div style={{ 
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem'
      }}>
        {/* BARRA DE FILTROS Y ACCIONES */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            background: 'white',
            padding: '0.5rem',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}>
            {['Todos', 'Pendiente', 'Entregado', 'Cancelado'].map(state => (
              <button
                key={state}
                onClick={() => setFilter(state)}
                style={{
                  padding: '0.75rem 1.25rem',
                  background: filter === state ? '#4f46e5' : 'transparent',
                  color: filter === state ? 'white' : '#6b7280',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
                onMouseOver={(e) => {
                  if (filter !== state) {
                    e.currentTarget.style.background = '#f3f4f6'
                    e.currentTarget.style.color = '#4b5563'
                  }
                }}
                onMouseOut={(e) => {
                  if (filter !== state) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = '#6b7280'
                  }
                }}
              >
                {state}
              </button>
            ))}
          </div>

          <button 
            onClick={clearAllOrdersHandler}
            style={{
              background: '#ef4444',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.25rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#dc2626'
              e.currentTarget.style.transform = 'scale(1.05)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#ef4444'
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            🗑️ Borrar Historial
          </button>
        </div>

        {/* CONTENIDO DE PEDIDOS */}
        {loading ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '4rem 1rem',
            color: '#6b7280'
          }}>
            <div style={{ 
              fontSize: '3rem', 
              marginBottom: '1rem',
              animation: 'pulse 1.5s ease-in-out infinite'
            }}>
              ⏳
            </div>
            <p style={{ 
              fontSize: '1.1rem',
              marginBottom: '1.5rem'
            }}>
              Cargando historial de pedidos...
            </p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '4rem 1rem',
            color: '#6b7280'
          }}>
            <div style={{ 
              fontSize: '3rem', 
              marginBottom: '1rem',
              opacity: 0.5
            }}>
              📋
            </div>
            <p style={{ 
              fontSize: '1.1rem',
              marginBottom: '0.5rem'
            }}>
              {filter === 'Todos' 
                ? 'No hay pedidos en tu historial' 
                : `No hay pedidos con estado: ${filter}`}
            </p>
            <p style={{ 
              fontSize: '0.95rem',
              opacity: 0.7
            }}>
              {filter === 'Todos' 
                ? 'Realiza tu primer pedido para comenzar' 
                : 'Intenta cambiar el filtro para ver más pedidos'}
            </p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
            gap: '1.5rem'
          }}>
            {filteredOrders.map(order => (
              <div 
                key={order.id}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  borderTop: `4px solid ${getStatusColor(order.status)}`,
                  position: 'relative',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'
                }}
              >
                {/* CABECERA DEL PEDIDO */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '1rem'
                }}>
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.5rem'
                    }}>
                      <span style={{
                        fontSize: '1rem',
                        background: '#f3f4f6',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#4f46e5'
                      }}>
                        #
                      </span>
                      <h2 style={{ 
                        margin: 0,
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        color: '#1f2937'
                      }}>
                        Pedido {order.id}
                      </h2>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.5rem'
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
                        🏪 {order.restaurant?.name || 'Desconocido'}
                      </span>
                      
                      <span style={{
                        background: '#fef3c7',
                        color: '#92400e',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}>
                        📅 {order.date || 'Sin fecha'}
                      </span>
                    </div>
                  </div>

                  {/* BOTÓN ELIMINAR */}
                  <button
                    onClick={() => deleteOrderHandler(order.id)}
                    style={{
                      background: '#fee2e2',
                      color: '#dc2626',
                      border: 'none',
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#fecaca'
                      e.currentTarget.style.transform = 'scale(1.1)'
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = '#fee2e2'
                      e.currentTarget.style.transform = 'scale(1)'
                    }}
                    title="Eliminar este pedido"
                  >
                    🗑️
                  </button>
                </div>

                {/* ESTADO DEL PEDIDO */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1rem',
                  paddingBottom: '1rem',
                  borderBottom: '2px solid #f3f4f6'
                }}>
                  <span style={{
                    fontSize: '0.9rem',
                    color: '#6b7280'
                  }}>
                    Estado:
                  </span>
                  <span style={{
                    background: getStatusColor(order.status) + '20',
                    color: getStatusColor(order.status),
                    padding: '0.35rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    {order.status === 'Pendiente' && '⏳'}
                    {order.status === 'Entregado' && '✅'}
                    {order.status === 'Cancelado' && '❌'}
                    {order.status || 'Sin estado'}
                  </span>
                </div>

                {/* LISTA DE PRODUCTOS */}
                <div style={{ marginBottom: '1rem' }}>
                  <h4 style={{ 
                    margin: '0 0 0.75rem',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    color: '#1f2937'
                  }}>
                    📦 Productos ({order.items?.length || 0})
                  </h4>
                  <div style={{ display: 'grid', gap: '0.5rem' }}>
                    {order.items?.slice(0, 3).map((item, i) => (
                      <div 
                        key={i}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '0.5rem',
                          background: '#fafafa',
                          borderRadius: '8px'
                        }}
                      >
                        <span style={{ fontSize: '0.9rem', color: '#4b5563' }}>
                          {item.name || 'Producto sin nombre'}
                        </span>
                        <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#059669' }}>
                          L. {(item.price || 0).toFixed(2)}
                        </span>
                      </div>
                    ))}
                    
                    {order.items && order.items.length > 3 && (
                      <div style={{
                        textAlign: 'center',
                        fontSize: '0.85rem',
                        color: '#6b7280',
                        padding: '0.5rem'
                      }}>
                        ... y {order.items.length - 3} productos más
                      </div>
                    )}
                  </div>
                </div>

                {/* TOTAL */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.5rem',
                  paddingTop: '1rem',
                  borderTop: '2px solid #f3f4f6'
                }}>
                  <span style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937' }}>
                    Total del pedido:
                  </span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#4f46e5' }}>
                    L. {(order.total || 0).toFixed(2)}
                  </span>
                </div>

                {/* ACCIONES */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '0.5rem'
                }}>
                  <button 
                    onClick={() => repeatOrder(order)}
                    style={{
                      background: '#e0e7ff',
                      color: '#4f46e5',
                      border: 'none',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#c7d2fe'
                      e.currentTarget.style.transform = 'scale(1.02)'
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = '#e0e7ff'
                      e.currentTarget.style.transform = 'scale(1)'
                    }}
                  >
                    🔄 Repetir
                  </button>
                  
                  {order.status !== 'Entregado' && (
                    <button 
                      onClick={() => updateStatus(order.id, 'Entregado')}
                      style={{
                        background: '#10b981',
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = '#059669'
                        e.currentTarget.style.transform = 'scale(1.02)'
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = '#10b981'
                        e.currentTarget.style.transform = 'scale(1)'
                      }}
                    >
                      ✅ Entregado
                    </button>
                  )}
                  
                  <button 
                    onClick={() => updateStatus(order.id, 'Cancelado')}
                    style={{
                      background: '#fee2e2',
                      color: '#dc2626',
                      border: 'none',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.2s ease',
                      gridColumn: 'span 2'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#fecaca'
                      e.currentTarget.style.transform = 'scale(1.02)'
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = '#fee2e2'
                      e.currentTarget.style.transform = 'scale(1)'
                    }}
                  >
                    ❌ Cancelar Pedido
                  </button>
                </div>
              </div>
            ))}
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
            © {new Date().getFullYear()} UJCV Eats — Historial de Pedidos
          </p>
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', opacity: 0.7 }}>
            Total de pedidos en sistema: {orders.length} • Última actualización: {new Date().toLocaleTimeString()}
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