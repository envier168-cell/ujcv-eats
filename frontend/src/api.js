// src/api.js

const API_URL = import.meta.env.VITE_API_URL
console.log('API_URL en runtime:', API_URL)

// -----------------------------
// 🔐 Autenticación (sin /api)
// -----------------------------
export async function loginUser(credentials) {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function registerUser(data) {
  const res = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

// -----------------------------
// 🏠 Restaurantes
// -----------------------------
export async function fetchRestaurants() {
  const res = await fetch(`${API_URL}/api/restaurants`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function fetchRestaurantById(id) {
  const res = await fetch(`${API_URL}/api/restaurants/${id}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function fetchMenu(restaurantId) {
  const res = await fetch(`${API_URL}/api/menu?restaurantId=${restaurantId}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

// -----------------------------
// ⭐ Favoritos y Top
// -----------------------------
export async function fetchFavorites() {
  const res = await fetch(`${API_URL}/api/favorites`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function fetchTopFavorites() {
  const res = await fetch(`${API_URL}/api/top-favorites`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

// -----------------------------
// 📜 Pedidos
// -----------------------------
export async function fetchOrders() {
  const res = await fetch(`${API_URL}/api/orders`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function createOrder(order) {
  const res = await fetch(`${API_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order)
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function updateOrder(id, updates) {
  const res = await fetch(`${API_URL}/api/orders/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function deleteOrder(id) {
  const res = await fetch(`${API_URL}/api/orders/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

// Borra todo el historial de pedidos
export async function clearOrders() {
  const res = await fetch(`${API_URL}/api/orders`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

// -----------------------------
// 🚚 Tracking
// -----------------------------
export async function fetchTracking(orderId) {
  const res = await fetch(`${API_URL}/api/tracking/${orderId}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}
