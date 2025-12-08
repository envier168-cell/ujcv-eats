import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from '../context/useToast'
import { createOrder } from '../api'

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState([])
  const [isMobile, setIsMobile] = useState(false)
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)
  const [loading, setLoading] = useState(false)
  const { show } = useToast()
  const navigate = useNavigate()

  // Detectar tamaño de pantalla
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cartItems') || '[]')
    const storedRestaurant = JSON.parse(localStorage.getItem('selectedRestaurant') || 'null')
    
    setCartItems(storedCart)
    setSelectedRestaurant(storedRestaurant)
  }, [])

  const total = cartItems.reduce((sum, item) => sum + item.price, 0)
  const deliveryFee = 0 // GRATIS para estudiantes UJCV
  const subtotal = total
  const tax = total * 0.15 // 15% de impuesto
  const grandTotal = subtotal + deliveryFee + tax

  // Colores de marca basado en el restaurante
  const getBrandColor = () => {
    if (!selectedRestaurant) return '#4f46e5'
    
    const name = selectedRestaurant.name?.toLowerCase() || ''
    
    if (name.includes('burger king')) return '#FF6B35'
    if (name.includes('mcdonald')) return '#FFBC0D'
    if (name.includes('pizza hut')) return '#FF0000'
    if (name.includes('subway')) return '#009F49'
    if (name.includes('kfc')) return '#E31837'
    
    return '#4f46e5'
  }

  const brandColor = getBrandColor()

  // Confirmar pedido
  const confirmOrder = async () => {
    if (cartItems.length === 0) {
      show('⚠️ No hay productos en el carrito', 'info', 2500)
      return
    }

    setLoading(true)

    const order = {
      items: cartItems,
      subtotal,
      deliveryFee,
      tax,
      total: grandTotal,
      restaurant: selectedRestaurant,
      date: new Date().toLocaleString(),
      status: 'Pendiente',
      estimatedTime: '25-35 min',
      orderNumber: `ORD-${Date.now().toString().slice(-6)}`,
      studentDiscount: true // Marcar como estudiante UJCV
    }

    try {
      const savedOrder = await createOrder(order)
      show(`✅ Pedido #${savedOrder.id || order.orderNumber} confirmado!`, 'success', 3000)

      localStorage.removeItem('cartItems')
      localStorage.removeItem('selectedRestaurant')
      setCartItems([])
      setSelectedRestaurant(null)

      // Redirigir a seguimiento después de confirmar
      setTimeout(() => {
        navigate('/tracking')
      }, 1500)

    } catch (err) {
      console.error(err)
      show('❌ Error al procesar el pedido', 'error', 3000)
    } finally {
      setLoading(false)
    }
  }

  // Vaciar carrito completo
  const clearCart = () => {
    if (cartItems.length === 0) {
      show('El carrito ya está vacío', 'info', 2500)
      return
    }
    
    if (window.confirm('¿Estás seguro de vaciar todo el carrito?')) {
      localStorage.removeItem('cartItems')
      localStorage.removeItem('selectedRestaurant')
      setCartItems([])
      setSelectedRestaurant(null)
      show('🗑️ Carrito vaciado', 'info', 2500)
    }
  }

  // Eliminar producto específico
  const removeItem = (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index)
    setCartItems(updatedCart)
    localStorage.setItem('cartItems', JSON.stringify(updatedCart))
    
    // Si no quedan items, eliminar también el restaurante
    if (updatedCart.length === 0) {
      localStorage.removeItem('selectedRestaurant')
      setSelectedRestaurant(null)
    }
    
    show('❌ Producto eliminado', 'info', 2500)
  }

  // Ajustar cantidad
  const updateQuantity = (index, delta) => {
    const updatedCart = [...cartItems]
    const currentItem = { ...updatedCart[index] }
    
    // Si el producto ya tiene cantidad, ajustarla
    if (currentItem.quantity) {
      currentItem.quantity += delta
      if (currentItem.quantity < 1) {
        removeItem(index)
        return
      }
    } else {
      // Si no tiene cantidad, inicializar
      currentItem.quantity = 2 + delta
      if (currentItem.quantity < 1) {
        removeItem(index)
        return
      }
    }
    
    // Actualizar precio total si hay cantidad
    if (currentItem.quantity && currentItem.basePrice) {
      currentItem.price = currentItem.basePrice * currentItem.quantity
    } else if (currentItem.quantity) {
      currentItem.basePrice = currentItem.price
      currentItem.price = currentItem.basePrice * currentItem.quantity
    }
    
    updatedCart[index] = currentItem
    setCartItems(updatedCart)
    localStorage.setItem('cartItems', JSON.stringify(updatedCart))
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      paddingBottom: '2rem'
    }}>
      {/* HEADER CON GRADIENTE VERDE (TEMA DE COMPRA) */}
      <div style={{
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: 'white',
        padding: isMobile ? '1rem' : '1.5rem 2rem',
        borderRadius: '0 0 20px 20px',
        boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)',
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
              <span style={{ fontSize: '1.8rem' }}>🛒</span>
              Carrito de Compras
            </h1>
            <p style={{ 
              margin: '0.25rem 0 0',
              opacity: 0.9,
              fontSize: isMobile ? '0.9rem' : '1rem'
            }}>
              Revisa y confirma tu pedido
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
            {!isMobile && 'Seguir comprando'}
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
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📦</div>
            <div style={{ 
              fontWeight: 'bold',
              fontSize: isMobile ? '1.1rem' : '1.25rem'
            }}>
              {cartItems.length} Productos
            </div>
            <div style={{ 
              fontSize: '0.9rem',
              opacity: 0.9
            }}>
              En tu carrito
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
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💰</div>
            <div style={{ 
              fontWeight: 'bold',
              fontSize: isMobile ? '1.1rem' : '1.25rem'
            }}>
              L. {subtotal.toFixed(2)}
            </div>
            <div style={{ 
              fontSize: '0.9rem',
              opacity: 0.9
            }}>
              Subtotal
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
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎓</div>
            <div style={{ 
              fontWeight: 'bold',
              fontSize: isMobile ? '1.1rem' : '1.25rem'
            }}>
              ¡Envío gratis!
            </div>
            <div style={{ 
              fontSize: '0.9rem',
              opacity: 0.9
            }}>
              Estudiante UJCV
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
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr',
          gap: '2rem'
        }}>
          {/* COLUMNA IZQUIERDA - PRODUCTOS */}
          <div>
            {/* INFO RESTAURANTE */}
            {selectedRestaurant && (
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '1.5rem',
                marginBottom: '1.5rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                borderLeft: `4px solid ${brandColor}`
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem'
                }}>
                  <div>
                    <h3 style={{ 
                      margin: 0,
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      color: '#1f2937'
                    }}>
                      🏪 {selectedRestaurant.name}
                    </h3>
                    <p style={{ 
                      margin: '0.25rem 0 0',
                      fontSize: '0.9rem',
                      color: '#6b7280'
                    }}>
                      📍 {selectedRestaurant.address}
                    </p>
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
                      color: '#6b7280'
                    }}>
                      ⭐ 4.5
                    </span>
                    <span style={{
                      background: '#f3f4f6',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      color: '#6b7280'
                    }}>
                      ⏱️ 20-30 min
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* LISTA DE PRODUCTOS */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: isMobile ? '1rem' : '1.5rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
                paddingBottom: '1rem',
                borderBottom: '2px solid #f3f4f6'
              }}>
                <h2 style={{ 
                  margin: 0,
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#1f2937'
                }}>
                  Tu pedido ({cartItems.length})
                </h2>
                
                {cartItems.length > 0 && (
                  <button 
                    onClick={clearCart}
                    style={{
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
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
                    🗑️ Vaciar todo
                  </button>
                )}
              </div>

              {cartItems.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '3rem 1rem',
                  color: '#6b7280'
                }}>
                  <div style={{ 
                    fontSize: '3rem', 
                    marginBottom: '1rem',
                    opacity: 0.5
                  }}>
                    🛒
                  </div>
                  <p style={{ 
                    fontSize: '1.1rem',
                    marginBottom: '1.5rem'
                  }}>
                    Tu carrito está vacío
                  </p>
                  <Link 
                    to="/"
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '500',
                      textDecoration: 'none',
                      display: 'inline-block',
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
                    Explorar restaurantes
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {cartItems.map((item, index) => (
                    <div 
                      key={index}
                      style={{
                        display: 'flex',
                        gap: '1rem',
                        padding: '1rem',
                        borderRadius: '12px',
                        background: '#fafafa',
                        border: '1px solid #f3f4f6',
                        position: 'relative',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => {
                        if (!isMobile) {
                          e.currentTarget.style.borderColor = '#e5e7eb'
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'
                        }
                      }}
                      onMouseOut={(e) => {
                        if (!isMobile) {
                          e.currentTarget.style.borderColor = '#f3f4f6'
                          e.currentTarget.style.boxShadow = 'none'
                        }
                      }}
                    >
                      {/* CONTROLES DE CANTIDAD */}
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}>
                        <button 
                          onClick={() => updateQuantity(index, 1)}
                          style={{
                            width: '28px',
                            height: '28px',
                            background: brandColor,
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          +
                        </button>
                        
                        <span style={{
                          fontWeight: '600',
                          fontSize: '0.9rem',
                          minWidth: '20px',
                          textAlign: 'center'
                        }}>
                          {item.quantity || 1}
                        </span>
                        
                        <button 
                          onClick={() => updateQuantity(index, -1)}
                          style={{
                            width: '28px',
                            height: '28px',
                            background: '#e5e7eb',
                            color: '#6b7280',
                            border: 'none',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          −
                        </button>
                      </div>

                      {/* INFORMACIÓN DEL PRODUCTO */}
                      <div style={{ flex: 1 }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: '0.5rem'
                        }}>
                          <h3 style={{ 
                            margin: 0,
                            fontSize: '1rem',
                            fontWeight: '600',
                            color: '#1f2937'
                          }}>
                            {item.name}
                          </h3>
                          <span style={{ 
                            fontWeight: 'bold',
                            color: brandColor,
                            fontSize: '1rem'
                          }}>
                            L. {(item.price || 0).toFixed(2)}
                          </span>
                        </div>
                        
                        {item.description && (
                          <p style={{ 
                            margin: '0 0 0.5rem',
                            fontSize: '0.9rem',
                            color: '#6b7280',
                            lineHeight: '1.4'
                          }}>
                            {item.description}
                          </p>
                        )}
                        
                        {item.restaurant && (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}>
                            <span style={{
                              fontSize: '0.8rem',
                              color: brandColor
                            }}>
                              🏢
                            </span>
                            <span style={{
                              fontSize: '0.8rem',
                              color: '#6b7280'
                            }}>
                              {item.restaurant}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* BOTÓN ELIMINAR */}
                      <button 
                        onClick={() => removeItem(index)}
                        style={{
                          position: 'absolute',
                          top: '0.5rem',
                          right: '0.5rem',
                          background: '#fee2e2',
                          color: '#dc2626',
                          border: 'none',
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
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
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* COLUMNA DERECHA - RESUMEN */}
          <div>
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: isMobile ? '1rem' : '1.5rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              position: 'sticky',
              top: '1rem'
            }}>
              <h2 style={{ 
                margin: '0 0 1.5rem',
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#1f2937'
              }}>
                Resumen del pedido
              </h2>

              {/* BANNER ESTUDIANTE UJCV */}
              <div style={{
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                color: 'white',
                padding: '1rem',
                borderRadius: '12px',
                marginBottom: '1.5rem',
                textAlign: 'center',
                border: '2px solid #6366f1'
              }}>
                <div style={{
                  fontSize: '1.8rem',
                  marginBottom: '0.5rem'
                }}>
                  🎓
                </div>
                <div style={{
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  marginBottom: '0.25rem'
                }}>
                  ¡Estudiante UJCV!
                </div>
                <div style={{
                  fontSize: '0.85rem',
                  opacity: 0.9
                }}>
                  Envío 100% GRATIS en todos tus pedidos
                </div>
              </div>

              {/* DESGLOSE DE PRECIOS */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.75rem',
                  paddingBottom: '0.75rem',
                  borderBottom: '1px solid #f3f4f6'
                }}>
                  <span style={{ fontSize: '0.95rem', color: '#6b7280' }}>Subtotal</span>
                  <span style={{ fontWeight: '500', color: '#1f2937' }}>
                    L. {subtotal.toFixed(2)}
                  </span>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.75rem',
                  paddingBottom: '0.75rem',
                  borderBottom: '1px solid #f3f4f6'
                }}>
                  <div>
                    <span style={{ fontSize: '0.95rem', color: '#6b7280' }}>Envío</span>
                    <span style={{
                      fontSize: '0.75rem',
                      background: '#dcfce7',
                      color: '#166534',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '12px',
                      marginLeft: '0.5rem',
                      fontWeight: '500'
                    }}>
                      GRATIS
                    </span>
                  </div>
                  <div>
                    <span style={{ 
                      textDecoration: 'line-through',
                      fontSize: '0.85rem',
                      color: '#9ca3af',
                      marginRight: '0.5rem'
                    }}>
                      L. 30.00
                    </span>
                    <span style={{ fontWeight: '500', color: '#059669' }}>
                      L. {deliveryFee.toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.75rem',
                  paddingBottom: '0.75rem',
                  borderBottom: '1px solid #f3f4f6'
                }}>
                  <span style={{ fontSize: '0.95rem', color: '#6b7280' }}>Impuestos (15%)</span>
                  <span style={{ fontWeight: '500', color: '#1f2937' }}>
                    L. {tax.toFixed(2)}
                  </span>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.5rem'
                }}>
                  <span style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937' }}>Total</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: brandColor }}>
                    L. {grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* INFORMACIÓN DE ENTREGA */}
              <div style={{
                background: '#f9fafb',
                borderRadius: '12px',
                padding: '1rem',
                marginBottom: '1.5rem'
              }}>
                <h4 style={{ 
                  margin: '0 0 0.5rem',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  color: '#1f2937'
                }}>
                  📍 Información de entrega
                </h4>
                <p style={{ 
                  margin: '0',
                  fontSize: '0.85rem',
                  color: '#6b7280'
                }}>
                  Tiempo estimado: <strong>25-35 minutos</strong>
                </p>
                <p style={{ 
                  margin: '0.25rem 0 0',
                  fontSize: '0.85rem',
                  color: '#6b7280'
                }}>
                  Método de pago: <strong>Tarjeta/Efectivo</strong>
                </p>
                <p style={{ 
                  margin: '0.25rem 0 0',
                  fontSize: '0.85rem',
                  color: '#059669',
                  fontWeight: '500'
                }}>
                  🎓 Beneficio estudiante UJCV activado
                </p>
              </div>

              {/* BOTÓN CONFIRMAR */}
              <button 
                onClick={confirmOrder}
                disabled={cartItems.length === 0 || loading}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: cartItems.length === 0 ? '#9ca3af' : brandColor,
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: cartItems.length === 0 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
                onMouseOver={(e) => {
                  if (cartItems.length > 0 && !loading) {
                    e.currentTarget.style.background = adjustColor(brandColor, -20)
                    e.currentTarget.style.transform = 'scale(1.02)'
                  }
                }}
                onMouseOut={(e) => {
                  if (cartItems.length > 0 && !loading) {
                    e.currentTarget.style.background = brandColor
                    e.currentTarget.style.transform = 'scale(1)'
                  }
                }}
              >
                {loading ? (
                  <>
                    <span style={{ animation: 'spin 1s linear infinite' }}>⏳</span>
                    Procesando...
                  </>
                ) : (
                  <>
                    <span>✅</span>
                    Confirmar Pedido • L. {grandTotal.toFixed(2)}
                  </>
                )}
              </button>

              {/* SEGURIDAD */}
              <div style={{
                marginTop: '1rem',
                textAlign: 'center'
              }}>
                <p style={{
                  margin: 0,
                  fontSize: '0.75rem',
                  color: '#9ca3af',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}>
                  🔒 Pago seguro • 📦 Entrega garantizada
                </p>
              </div>
            </div>
          </div>
        </div>

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
            © {new Date().getFullYear()} UJCV Eats — Carrito de compras
          </p>
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', opacity: 0.7 }}>
            Precios incluyen impuestos • Cancelación gratuita en 5 minutos
          </p>
          <p style={{ 
            margin: '0.25rem 0 0', 
            fontSize: '0.85rem', 
            color: '#059669',
            fontWeight: '500'
          }}>
            🎓 Envío gratis para estudiantes UJCV
          </p>
        </div>
      </div>

      {/* ESTILOS DE ANIMACIÓN EN LÍNEA */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
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