const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')

const app = express()
app.use(express.json())

// CORS: permite tu(s) dominio(s) de frontend en Vercel
app.use(cors({
  origin: [
    'http://localhost:5173', // 👈 necesario para desarrollo local
    'https://ujcv-eats.vercel.app',
    'https://ujcv-eats-1ye6zumvf-jackloxo690-4164s-projects.vercel.app'
  ],
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type']
}))

// 📦 Archivo de pedidos
const ordersFile = path.join(__dirname, 'orders.json')

// Asegurarse de que el archivo orders.json exista
if (!fs.existsSync(ordersFile)) {
  fs.writeFileSync(ordersFile, JSON.stringify([], null, 2))
  console.log('📄 Archivo orders.json creado automáticamente')
}

// 🍔 Lista de restaurantes
const restaurants = [
  { id: 1, name: 'Burger King Comayagua', address: 'Boulevard Roberto Romero Larios, Comayagua' },
  { id: 2, name: 'McDonald\'s Comayagua', address: 'Centro Comercial Mall Premier, Comayagua' },
  { id: 3, name: 'Pizza Hut Comayagua', address: 'Barrio La Caridad, Comayagua' },
  { id: 4, name: 'Subway Comayagua', address: 'Avenida 1 de Mayo, Comayagua' },
  { id: 5, name: 'KFC Comayagua', address: 'Mall Premier, Comayagua' }
]

// 🍽️ Menús por restaurante
const menus = {
  1: [
    { id: 101, name: 'Whopper', description: 'Hamburguesa clásica con carne a la parrilla', price: 120, image: '/images/whopper.png' },
    { id: 102, name: 'Papas grandes', description: 'Papas fritas crujientes', price: 45, image: '/images/papas-grandes.png' },
    { id: 103, name: 'Refresco grande', description: 'Bebida gaseosa a elección', price: 35, image: '/images/refresco-grande.png' }
  ],
  2: [
    { id: 201, name: 'Big Mac', description: 'Hamburguesa doble con salsa especial', price: 130, image: '/images/big-mac.png' },
    { id: 202, name: 'McFlurry Oreo', description: 'Helado con trozos de galleta Oreo', price: 55, image: '/images/mcflurry-oreo.png' },
    { id: 203, name: 'Combo Cajita Feliz', description: 'Menú infantil con juguete', price: 90, image: '/images/cajita-feliz.png' }
  ],
  3: [
    { id: 301, name: 'Pizza Suprema', description: 'Pizza con pepperoni, vegetales y queso', price: 180, image: '/images/pizza-suprema.png' },
    { id: 302, name: 'Pan de ajo', description: 'Pan horneado con mantequilla y ajo', price: 40, image: '/images/pan-de-ajo.png' },
    { id: 303, name: 'Refresco 1.5L', description: 'Botella de gaseosa familiar', price: 60, image: '/images/refresco-1-5l.png' }
  ],
  4: [
    { id: 401, name: 'Sub Italiano BMT', description: 'Jamón, pepperoni y salami en pan fresco', price: 110, image: '/images/sub-italiano-bmt.png' },
    { id: 402, name: 'Sub Pollo Teriyaki', description: 'Pollo en salsa teriyaki con vegetales', price: 115, image: '/images/sub-pollo-teriyaki.png' },
    { id: 403, name: 'Galleta de chocolate', description: 'Galleta horneada con chispas de chocolate', price: 25, image: '/images/galleta-chocolate.png' }
  ],
  5: [
    { id: 501, name: 'Bucket de pollo (8 piezas)', description: 'Pollo frito crujiente estilo KFC', price: 220, image: '/images/kfc-bucket-8.png' },
    { id: 502, name: 'Puré con gravy', description: 'Puré de papa con salsa especial', price: 50, image: '/images/pure-gravy.png' },
    { id: 503, name: 'Ensalada coleslaw', description: 'Ensalada fresca de repollo y zanahoria', price: 45, image: '/images/coleslaw.png' }
  ]
}

// 🩺 Salud del servicio
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: Date.now(),
    service: 'UJCV Eats API',
    version: '1.0.0'
  })
})

// 📍 Endpoints restaurantes y menús (con /api)
app.get('/api/restaurants', (req, res) => res.json(restaurants))

app.get('/api/restaurants/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const restaurant = restaurants.find(r => r.id === id)
  restaurant ? res.json(restaurant) : res.status(404).json({ error: 'Restaurante no encontrado' })
})

app.get('/api/menu', (req, res) => {
  const restaurantId = parseInt(req.query.restaurantId)
  res.json(menus[restaurantId] || [])
})

// ✅ Lo más pedido esta semana
app.get('/api/top-favorites', (req, res) => {
  res.json([
    { name: 'Whopper', count: 120 },
    { name: 'Pizza Pepperoni', count: 95 },
    { name: 'Sub de Pollo', count: 80 }
  ])
})

// ✅ Seguimiento de pedido
app.get('/api/tracking/:orderId', (req, res) => {
  const { orderId } = req.params
  res.json({
    orderId,
    progress: ['👨‍🍳', '🚚', '🏫'],
    etaMinutes: 25,
    deliveryPerson: {
      name: 'Carlos López',
      phone: '+504 9876-5432',
      vehicle: 'Moto Honda'
    }
  })
})

// ============================================================================
// 🔐 ENDPOINTS DE AUTENTICACIÓN - SOLUCIÓN RÁPIDA
// ============================================================================

// 📧 Endpoint PRINCIPAL de login (con /api)
app.post('/api/login', (req, res) => {
  console.log('📧 Login recibido:', req.body.email || 'sin email')
  
  // Respuesta MOCK para demo - siempre exitosa
  res.json({
    success: true,
    user: {
      id: Date.now(),
      email: req.body.email || 'demo@ujcv.edu.hn',
      name: req.body.email ? req.body.email.split('@')[0] : 'Estudiante UJCV',
      accountNumber: req.body.accountNumber || 'UJCV' + Math.floor(1000 + Math.random() * 9000),
      address: req.body.address || 'Campus UJCV, Comayagua',
      isStudent: true,
      deliveryDiscount: true, // Envío gratis para estudiantes
      avatar: `https://ui-avatars.com/api/?name=${req.body.email?.split('@')[0] || 'Demo'}&background=4f46e5&color=fff`
    },
    token: 'ujcv-token-' + Date.now(),
    message: '✅ ¡Login exitoso! (Modo demo) 🎓 Envío gratis activado para estudiantes UJCV'
  })
})

// 📝 Endpoint de registro (opcional)
app.post('/api/register', (req, res) => {
  console.log('📝 Registro recibido:', req.body.email || 'sin email')
  
  res.json({
    success: true,
    user: {
      id: Date.now(),
      email: req.body.email || 'nuevo@ujcv.edu.hn',
      name: req.body.name || 'Nuevo Usuario',
      accountNumber: req.body.accountNumber || 'UJCV' + Date.now().toString().slice(-6),
      address: req.body.address || 'Dirección no especificada',
      isStudent: req.body.email ? req.body.email.includes('ujcv') : true,
      deliveryDiscount: req.body.email ? req.body.email.includes('ujcv') : true
    },
    token: 'ujcv-token-reg-' + Date.now(),
    message: '✅ ¡Registro exitoso!'
  })
})

// 👤 Endpoint para obtener perfil
app.get('/api/profile', (req, res) => {
  res.json({
    success: true,
    user: {
      id: 1,
      email: 'estudiante@ujcv.edu.hn',
      name: 'Carlos Martínez',
      accountNumber: 'UJCV2024001',
      address: 'Campus UJCV, Comayagua',
      isStudent: true,
      deliveryDiscount: true,
      joinDate: '2024-01-15',
      ordersCount: 8,
      totalSpent: 1245.75,
      avatar: 'https://ui-avatars.com/api/?name=Carlos+Martinez&background=4f46e5&color=fff'
    }
  })
})

// 🔁 Endpoint de login SIN /api (para compatibilidad con código antiguo)
app.post('/login', (req, res) => {
  console.log('⚠️ Login legacy recibido (sin /api) - Redirigiendo a /api/login')
  
  // Redirige internamente al endpoint correcto
  res.json({
    success: true,
    user: {
      id: Date.now(),
      email: req.body.email || 'legacy@ujcv.edu.hn',
      name: 'Usuario Legacy',
      isStudent: true,
      deliveryDiscount: true
    },
    token: 'legacy-token-' + Date.now(),
    message: '✅ Login legacy exitoso - Usa /api/login en el futuro'
  })
})

// ============================================================================
// 🧾 ENDPOINTS DE PEDIDOS
// ============================================================================

app.get('/api/orders', (req, res) => {
  try {
    const orders = JSON.parse(fs.readFileSync(ordersFile))
    res.json(orders)
  } catch (error) {
    console.error('Error leyendo orders:', error)
    res.json([])
  }
})

app.post('/api/orders', (req, res) => {
  try {
    const orders = JSON.parse(fs.readFileSync(ordersFile))
    const newOrder = { 
      id: Date.now(), 
      ...req.body,
      createdAt: new Date().toISOString()
    }
    
    // Calcular total si no viene
    if (typeof newOrder.total !== 'number') {
      newOrder.total = newOrder.items?.reduce((sum, item) => sum + (item.price || 0), 0) || 0
    }
    
    orders.push(newOrder)
    fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2))
    console.log('✅ Pedido creado:', newOrder.id)
    res.status(201).json(newOrder)
  } catch (error) {
    console.error('Error creando pedido:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

app.patch('/api/orders/:id', (req, res) => {
  try {
    const orders = JSON.parse(fs.readFileSync(ordersFile))
    const id = parseInt(req.params.id)
    const index = orders.findIndex(o => o.id === id)
    
    if (index === -1) {
      return res.status(404).json({ error: 'Pedido no encontrado' })
    }
    
    orders[index] = { ...orders[index], ...req.body, updatedAt: new Date().toISOString() }
    fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2))
    console.log('📝 Pedido actualizado:', id)
    res.json(orders[index])
  } catch (error) {
    console.error('Error actualizando pedido:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

app.delete('/api/orders/:id', (req, res) => {
  try {
    const orders = JSON.parse(fs.readFileSync(ordersFile))
    const id = parseInt(req.params.id)
    const filtered = orders.filter(o => o.id !== id)
    
    fs.writeFileSync(ordersFile, JSON.stringify(filtered, null, 2))
    console.log('🗑️ Pedido eliminado:', id)
    res.json({ success: true, message: `Pedido ${id} eliminado` })
  } catch (error) {
    console.error('Error eliminando pedido:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

app.delete('/api/orders', (req, res) => {
  try {
    fs.writeFileSync(ordersFile, JSON.stringify([], null, 2))
    console.log('🗑️ Todos los pedidos eliminados')
    res.json({ success: true, message: 'Historial de pedidos borrado' })
  } catch (error) {
    console.error('Error borrando pedidos:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// ============================================================================
// 🚀 INICIAR SERVIDOR
// ============================================================================

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`✅ Servidor backend UJCV Eats corriendo en puerto ${PORT}`)
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`)
  console.log(`🔐 Login endpoint: http://localhost:${PORT}/api/login`)
  console.log(`📦 Orders endpoint: http://localhost:${PORT}/api/orders`)
})