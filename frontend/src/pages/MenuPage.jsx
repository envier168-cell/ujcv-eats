import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useToast } from '../context/useToast'
import { fetchMenu, fetchRestaurantById } from '../api'

export default function MenuPage() {
  const { id } = useParams()
  const [menu, setMenu] = useState([])
  const [restaurant, setRestaurant] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const { show } = useToast()

  // Detectar tamaño de pantalla
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    let mounted = true

    fetchMenu(id)
      .then(data => { if (mounted) setMenu(data) })
      .catch(() => { 
        if (mounted) {
          setMenu([])
          // Datos de ejemplo si falla la API
          const mockMenu = getMockMenu(id)
          setMenu(mockMenu)
        }
      })

    fetchRestaurantById(id)
      .then(data => { if (mounted) setRestaurant(data) })
      .catch(() => { 
        if (mounted) {
          setRestaurant(null)
          // Datos de ejemplo si falla la API
          const mockRestaurant = getMockRestaurant(id)
          setRestaurant(mockRestaurant)
        }
      })

    return () => { mounted = false }
  }, [id])

  // BANNERS CON LAS IMÁGENES QUE PROPORCIONASTE
  const bannerImages = {
    'burger king': 'https://conexion360.mx/wp-content/uploads/2021/02/FOTO-WEB-BUGER-KING.jpg',
    'mcdonalds': 'https://wallpapercave.com/wp/wp11260474.png',
    'pizza hut': 'https://logo-marque.com/wp-content/uploads/2021/10/Pizza-Hut-Logo-2010-2014.jpg',
    'subway': 'https://tse3.mm.bing.net/th/id/OIP.noHXoXpS7C2nlSosSG7nMAHaCI?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3',
    'kfc': 'https://th.bing.com/th/id/R.15c78fa20effbc6889920927badccf9f?rik=3dhJtSGcfHRHig&riu=http%3a%2f%2fkfcshop.ca%2fcdn%2fshop%2ffiles%2fkfc-social-image.jpg%3fv%3d1692971149&ehk=OFG3JJHgmDBqNEUUudeD6Hfp0aaY4IKLKCbHrj9n8Mg%3d&risl=&pid=ImgRaw&r=0',
    'default': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=400&fit=crop'
  }

  // Colores de marca para botones y elementos
  const brandColors = {
    'burger king': '#FF6B35', // Naranja BK
    'mcdonalds': '#FFBC0D',   // Amarillo McD
    'pizza hut': '#FF0000',   // Rojo Pizza Hut
    'subway': '#009F49',      // Verde Subway
    'kfc': '#E31837',         // Rojo KFC
    'default': '#4f46e5'      // Azul por defecto
  }

  // Obtener assets basado en el nombre del restaurante
  const getBrandAssets = () => {
    if (!restaurant) return { 
      banner: bannerImages.default, 
      color: brandColors.default 
    }
    
    const name = restaurant.name.toLowerCase()
    
    if (name.includes('burger king') || name.includes('burgerking')) {
      return { 
        banner: bannerImages['burger king'], 
        color: brandColors['burger king'] 
      }
    }
    if (name.includes('mcdonald') || name.includes('mcdonalds')) {
      return { 
        banner: bannerImages.mcdonalds, 
        color: brandColors.mcdonalds 
      }
    }
    if (name.includes('pizza hut') || name.includes('pizzahut')) {
      return { 
        banner: bannerImages['pizza hut'], 
        color: brandColors['pizza hut'] 
      }
    }
    if (name.includes('subway')) {
      return { 
        banner: bannerImages.subway, 
        color: brandColors.subway 
      }
    }
    if (name.includes('kfc')) {
      return { 
        banner: bannerImages.kfc, 
        color: brandColors.kfc 
      }
    }
    
    return { 
      banner: bannerImages.default, 
      color: brandColors.default 
    }
  }

  const addToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem('cartItems') || '[]')
    const newCart = [...cart, item]
    localStorage.setItem('cartItems', JSON.stringify(newCart))

    if (restaurant) {
      localStorage.setItem('selectedRestaurant', JSON.stringify(restaurant))
    }

    show(`✅ ${item.name} añadido al carrito`, 'success', 2500)
  }

  // Datos de ejemplo para desarrollo
  const getMockRestaurant = (restaurantId) => {
    const restaurants = {
      '1': { id: 1, name: "Burger King Comayagua", address: "Centro Comercial, Comayagua" },
      '2': { id: 2, name: "McDonald's Comayagua", address: "Boulevard Principal, Comayagua" },
      '3': { id: 3, name: "Pizza Hut Comayagua", address: "Zona Centro, Comayagua" },
      '4': { id: 4, name: "Subway Comayagua", address: "Plaza Central, Comayagua" },
      '5': { id: 5, name: "KFC Comayagua", address: "Avenida Principal, Comayagua" }
    }
    return restaurants[restaurantId] || { id: restaurantId, name: "Restaurante", address: "Comayagua" }
  }

  const getMockMenu = (restaurantId) => {
    const menus = {
      '1': [
        { id: 101, name: "Whopper", description: "Hamburguesa con carne a la parrilla, lechuga, tomate y mayonesa", price: 120, image: "/images/burger1.jpg" },
        { id: 102, name: "Cheeseburger", description: "Hamburguesa con queso americano", price: 90, image: "/images/burger2.jpg" },
        { id: 103, name: "Papas Fritas King", description: "Porción grande de papas fritas", price: 45, image: "/images/fries.jpg" },
        { id: 104, name: "Refresco", description: "Bebida gaseosa 500ml", price: 25, image: "/images/soda.jpg" }
      ],
      '2': [
        { id: 201, name: "Big Mac", description: "Dos carnes de res con salsa especial, lechuga y queso", price: 130, image: "/images/bigmac.jpg" },
        { id: 202, name: "Cuarto de Libra", description: "Hamburguesa con queso y salsa", price: 110, image: "/images/quarter.jpg" },
        { id: 203, name: "McNuggets", description: "6 piezas de nuggets de pollo", price: 65, image: "/images/nuggets.jpg" },
        { id: 204, name: "McFlurry Oreo", description: "Helado suave con trozos de galleta Oreo", price: 55, image: "/images/mcflurry.jpg" }
      ],
      '3': [
        { id: 301, name: "Pizza Pepperoni", description: "Pizza grande con pepperoni y queso mozzarella", price: 180, image: "/images/pepperoni.jpg" },
        { id: 302, name: "Pizza Hawaiana", description: "Pizza mediana con piña y jamón", price: 150, image: "/images/hawaiian.jpg" },
        { id: 303, name: "Alitas BBQ", description: "10 piezas de alitas de pollo con salsa BBQ", price: 120, image: "/images/wings.jpg" },
        { id: 304, name: "Pan de Ajo", description: "8 piezas de pan de ajo con queso", price: 40, image: "/images/garlicbread.jpg" }
      ],
      '4': [
        { id: 401, name: "Sub Club", description: "Pavo, jamón, carne de res, vegetales", price: 110, image: "/images/subclub.jpg" },
        { id: 402, name: "Italian B.M.T.", description: "Salami, pepperoni, jamón", price: 115, image: "/images/italian.jpg" },
        { id: 403, name: "Veggie Delite", description: "Vegetales frescos", price: 95, image: "/images/veggie.jpg" }
      ],
      '5': [
        { id: 501, name: "Bucket de Pollo", description: "8 piezas de pollo frito", price: 200, image: "/images/bucket.jpg" },
        { id: 502, name: "Twister", description: "Wrap de pollo crujiente", price: 85, image: "/images/twister.jpg" },
        { id: 503, name: "Papas Fritas", description: "Porción familiar", price: 50, image: "/images/kfc-fries.jpg" }
      ]
    }
    return menus[restaurantId] || []
  }

  const brandAssets = getBrandAssets()

  return (
    <div 
      className={`restaurant-theme restaurant-${restaurant?.name?.toLowerCase() || ''}`} 
      style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}
    >
      {/* BANNER CON IMAGEN PROPORCIONADA */}
      <div style={{
        position: 'relative',
        height: '55vh',
        minHeight: '300px',
        maxHeight: '450px',
        width: '100%',
        overflow: 'hidden'
      }}>
        {/* Imagen de fondo */}
        <img 
          src={brandAssets.banner}
          alt={restaurant?.name || 'Banner del restaurante'}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center'
          }}
        />
        
        {/* Overlay con gradiente para difuminado */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '50%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 40%, transparent 100%)'
        }} />
        
        {/* Botón REGRESAR - IZQUIERDA */}
        <Link 
          to="/" 
          style={{
            position: 'absolute',
            top: '1.5rem',
            left: '1.5rem',
            background: 'rgba(0,0,0,0.6)',
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
            e.currentTarget.style.background = 'rgba(0,0,0,0.8)'
            e.currentTarget.style.transform = 'translateX(-3px)'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(0,0,0,0.6)'
            e.currentTarget.style.transform = 'translateX(0)'
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>←</span>
          {!isMobile && 'Volver'}
        </Link>
        
        {/* Botón CARRITO - DERECHA */}
        <Link 
          to="/checkout" 
          style={{
            position: 'absolute',
            top: '1.5rem',
            right: '1.5rem',
            background: brandAssets.color,
            color: 'white',
            padding: '0.75rem 1.25rem',
            borderRadius: '50px',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            boxShadow: `0 4px 15px ${brandAssets.color}40`
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = adjustColor(brandAssets.color, -20)
            e.currentTarget.style.transform = 'translateX(3px)'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = brandAssets.color
            e.currentTarget.style.transform = 'translateX(0)'
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>🛒</span>
          {!isMobile && 'Carrito'}
        </Link>

        {/* Información del restaurante */}
        <div style={{
          position: 'absolute',
          bottom: '2rem',
          left: '1.5rem',
          right: '1.5rem',
          color: 'white'
        }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: isMobile ? '1.8rem' : '2.2rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem',
            textShadow: '0 2px 8px rgba(0,0,0,0.6)'
          }}>
            {restaurant ? restaurant.name : 'Cargando restaurante...'}
          </h1>
          
          {restaurant?.address && (
            <p style={{ 
              margin: 0,
              fontSize: isMobile ? '1rem' : '1.1rem',
              opacity: 0.9,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem'
            }}>
              <span style={{ fontSize: '1.2rem' }}>📍</span> 
              {restaurant.address}
            </p>
          )}
          
          {/* Badges informativos */}
          <div style={{
            display: 'flex',
            gap: '0.75rem',
            flexWrap: 'wrap'
          }}>
            <span style={{
              background: 'rgba(255,255,255,0.2)',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontSize: '0.9rem',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              ⭐ 4.5/5
            </span>
            <span style={{
              background: 'rgba(255,255,255,0.2)',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontSize: '0.9rem',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              ⏱️ 20-30 min
            </span>
            <span style={{
              background: 'rgba(255,255,255,0.2)',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontSize: '0.9rem',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              💳 Tarjetas/Efectivo
            </span>
          </div>
        </div>
      </div>

      {/* CONTENIDO DEL MENÚ */}
      <div style={{ 
        padding: isMobile ? '1rem' : '1.5rem',
        maxWidth: '900px',
        margin: '0 auto',
        marginTop: isMobile ? '-30px' : '-50px',
        position: 'relative',
        zIndex: 2
      }}>
        <div style={{
          background: 'white',
          borderRadius: isMobile ? '16px' : '20px',
          padding: isMobile ? '1.25rem' : '2rem',
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: isMobile ? '1.5rem' : '2rem',
            paddingBottom: isMobile ? '1rem' : '1.5rem',
            borderBottom: '2px solid #f3f4f6'
          }}>
            <h2 style={{ 
              margin: 0, 
              fontSize: isMobile ? '1.25rem' : '1.5rem',
              fontWeight: 'bold',
              color: '#1f2937'
            }}>
              🍽️ Menú Disponible
            </h2>
            <span style={{
              background: '#f3f4f6',
              padding: isMobile ? '0.4rem 0.8rem' : '0.5rem 1rem',
              borderRadius: '8px',
              color: '#6b7280',
              fontSize: isMobile ? '0.85rem' : '0.9rem',
              fontWeight: '500'
            }}>
              {menu.length} {menu.length === 1 ? 'producto' : 'productos'}
            </span>
          </div>

          <div style={{ display: 'grid', gap: isMobile ? '1rem' : '1.5rem' }}>
            {menu.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: isMobile ? '2rem 1rem' : '3rem 1rem',
                color: '#6b7280'
              }}>
                <div style={{ 
                  fontSize: isMobile ? '2.5rem' : '3rem', 
                  marginBottom: '1rem',
                  opacity: 0.5
                }}>
                  🍴
                </div>
                <p style={{ 
                  fontSize: isMobile ? '1rem' : '1.1rem',
                  marginBottom: '1.5rem'
                }}>
                  No hay productos disponibles en este restaurante.
                </p>
                <Link 
                  to="/"
                  style={{
                    padding: isMobile ? '0.75rem 1.5rem' : '0.85rem 2rem',
                    background: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '500',
                    textDecoration: 'none',
                    display: 'inline-block'
                  }}
                >
                  Ver otros restaurantes
                </Link>
              </div>
            ) : (
              menu.map(item => (
                <div 
                  key={item.id} 
                  className="card"
                  style={{ 
                    display: 'flex', 
                    gap: isMobile ? '1rem' : '1.5rem', 
                    alignItems: 'stretch',
                    padding: isMobile ? '1rem' : '1.5rem', 
                    border: '1px solid #f3f4f6', 
                    borderRadius: isMobile ? '12px' : '16px',
                    backgroundColor: '#fff',
                    flexDirection: isMobile ? 'column' : 'row-reverse',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    if (!isMobile) {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)'
                      e.currentTarget.style.borderColor = '#e5e7eb'
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isMobile) {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'none'
                      e.currentTarget.style.borderColor = '#f3f4f6'
                    }
                  }}
                >
                  {/* Imagen del platillo */}
                  {item.image && (
                    <div style={{
                      flex: '0 0 auto',
                      width: isMobile ? '100%' : '160px',
                      height: isMobile ? '140px' : '160px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: isMobile ? '8px' : '12px',
                      overflow: 'hidden',
                      backgroundColor: '#f9fafb'
                    }}>
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        style={{ 
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                  )}

                  {/* Información del platillo */}
                  <div style={{ 
                    flex: 1, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <h2 style={{ 
                        margin: 0, 
                        fontSize: isMobile ? '1.1rem' : '1.25rem',
                        fontWeight: '600',
                        marginBottom: '0.5rem',
                        color: '#1f2937'
                      }}>
                        {item.name}
                      </h2>
                      <p style={{ 
                        margin: '0 0 0.75rem', 
                        color: '#6b7280',
                        lineHeight: '1.5',
                        fontSize: isMobile ? '0.9rem' : '1rem'
                      }}>
                        {item.description}
                      </p>
                      <p style={{ 
                        margin: 0,
                        fontSize: isMobile ? '1.1rem' : '1.2rem',
                        fontWeight: 'bold', 
                        color: brandAssets.color
                      }}>
                        Lps {typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
                      </p>
                    </div>

                    <button 
                      onClick={() => addToCart(item)} 
                      className="button-add"
                      style={{ 
                        marginTop: '1rem',
                        padding: isMobile ? '0.6rem 1rem' : '0.75rem 1.5rem',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: brandAssets.color,
                        color: '#fff',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        fontWeight: '600',
                        fontSize: isMobile ? '0.9rem' : '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        alignSelf: 'flex-start'
                      }}
                      onMouseOver={(e) => {
                        if (!isMobile) {
                          e.currentTarget.style.backgroundColor = adjustColor(brandAssets.color, -20)
                          e.currentTarget.style.transform = 'scale(1.02)'
                        }
                      }}
                      onMouseOut={(e) => {
                        if (!isMobile) {
                          e.currentTarget.style.backgroundColor = brandAssets.color
                          e.currentTarget.style.transform = 'scale(1)'
                        }
                      }}
                    >
                      <span style={{ fontSize: '1.2rem' }}>➕</span>
                      <span>Añadir al carrito</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Función auxiliar para ajustar colores
function adjustColor(color, amount) {
  // Si el color es un código hexadecimal
  if (color.startsWith('#')) {
    return '#' + color.replace(/^#/, '').replace(/../g, color => 
      ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2)
    )
  }
  // Si no es hexadecimal, devolver el color original
  return color
}