// src/api.js

// ============================================================================
// 🚀 CONFIGURACIÓN DE URLS PARA PRODUCCIÓN/DESARROLLO
// ============================================================================

// Modo 1: Usando variables de entorno (recomendado)
const isProduction = import.meta.env.PROD
const API_BASE = import.meta.env.VITE_API_BASE_URL

// Modo 2: Configuración manual (descomenta si el modo 1 no funciona)
// const isProduction = window.location.hostname !== 'localhost'
// const API_BASE = isProduction 
//   ? 'https://ujcv-eats.onrender.com'
//   : 'http://localhost:3000'

// Modo 3: Configuración final (usa esta si las otras fallan)
const API_URL = isProduction
  ? 'https://ujcv-eats.onrender.com'
  : (API_BASE || 'http://localhost:3000')

console.log('🚀 ====================================')
console.log('🌐 Entorno:', isProduction ? 'PRODUCCIÓN' : 'DESARROLLO')
console.log('🔗 API_URL:', API_URL)
console.log('🔄 VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL || 'No definida')
console.log('📍 Host actual:', window.location.hostname)
console.log('🚀 ====================================')

// ============================================================================
// 🛠️ FUNCIÓN DE AYUDA PARA FETCH
// ============================================================================

async function fetchAPI(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  }

  console.log(`🔗 Fetching: ${url}`)
  
  try {
    const response = await fetch(url, { ...defaultOptions, ...options })
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Error sin mensaje')
      console.error(`❌ Error ${response.status} en ${endpoint}:`, errorText)
      throw new Error(`Error ${response.status}: ${errorText.substring(0, 100)}`)
    }
    
    const data = await response.json()
    console.log(`✅ Success ${endpoint}:`, data)
    return data
    
  } catch (error) {
    console.error(`🔥 Error en fetchAPI ${endpoint}:`, error.message)
    
    // Si es error de red en producción, muestra mensaje amigable
    if (error.message.includes('Failed to fetch') && isProduction) {
      throw new Error('No se pudo conectar con el servidor. Verifica tu conexión a internet.')
    }
    
    throw error
  }
}

// ============================================================================
// 🔐 AUTENTICACIÓN
// ============================================================================

export async function loginUser(credentials) {
  return fetchAPI('/api/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  })
}

export async function registerUser(data) {
  return fetchAPI('/api/register', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

export async function getProfile() {
  const token = localStorage.getItem('token')
  return fetchAPI('/api/profile', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
}

// ============================================================================
// 🏠 RESTAURANTES
// ============================================================================

export async function fetchRestaurants() {
  return fetchAPI('/api/restaurants')
}

export async function fetchRestaurantById(id) {
  return fetchAPI(`/api/restaurants/${id}`)
}

export async function fetchMenu(restaurantId) {
  return fetchAPI(`/api/menu?restaurantId=${restaurantId}`)
}

// ============================================================================
// ⭐ FAVORITOS Y TOP
// ============================================================================

export async function fetchFavorites() {
  return fetchAPI('/api/favorites')
}

export async function fetchTopFavorites() {
  return fetchAPI('/api/top-favorites')
}

// ============================================================================
// 📜 PEDIDOS
// ============================================================================

export async function fetchOrders() {
  return fetchAPI('/api/orders')
}

export async function createOrder(order) {
  return fetchAPI('/api/orders', {
    method: 'POST',
    body: JSON.stringify(order)
  })
}

export async function updateOrder(id, updates) {
  return fetchAPI(`/api/orders/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates)
  })
}

export async function deleteOrder(id) {
  return fetchAPI(`/api/orders/${id}`, {
    method: 'DELETE'
  })
}

export async function clearOrders() {
  return fetchAPI('/api/orders', {
    method: 'DELETE'
  })
}

// ============================================================================
// 🚚 SEGUIMIENTO
// ============================================================================

export async function fetchTracking(orderId) {
  return fetchAPI(`/api/tracking/${orderId}`)
}

// ============================================================================
// 🩺 VERIFICACIÓN DE CONEXIÓN
// ============================================================================

export async function checkHealth() {
  return fetchAPI('/api/health')
}

// ============================================================================
// 🎯 FUNCIÓN PARA PROBAR TODOS LOS ENDPOINTS
// ============================================================================

export async function testAllEndpoints() {
  const results = {}
  
  try {
    // 1. Health check
    results.health = await checkHealth()
    console.log('✅ Health check passed')
    
    // 2. Restaurantes
    results.restaurants = await fetchRestaurants()
    console.log('✅ Restaurantes cargados:', results.restaurants.length)
    
    // 3. Test login (si hay restaurantes)
    if (results.restaurants.length > 0) {
      results.login = await loginUser({
        email: 'test@ujcv.edu.hn',
        password: 'test123'
      }).catch(err => ({ error: err.message }))
      console.log('✅ Login test completed')
    }
    
    return {
      success: true,
      message: 'Todos los endpoints funcionan correctamente',
      results
    }
    
  } catch (error) {
    console.error('❌ Error en test de endpoints:', error)
    return {
      success: false,
      message: error.message,
      results
    }
  }
}

// ============================================================================
// 🔄 INICIALIZACIÓN AUTOMÁTICA (opcional)
// ============================================================================

// Verifica la conexión al cargar la página (solo en desarrollo)
if (!isProduction) {
  setTimeout(() => {
    checkHealth()
      .then(health => console.log('🟢 Backend conectado:', health))
      .catch(err => console.warn('🟡 Backend no disponible:', err.message))
  }, 1000)
}