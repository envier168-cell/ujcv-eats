const API_URL = import.meta.env.VITE_API_URL
console.log('API_URL en runtime:', API_URL)

// 🏠 Restaurantes
export async function fetchRestaurants() {
  const res = await fetch(`${API_URL}/restaurants`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function fetchMenu(restaurantId) {
  const res = await fetch(`${API_URL}/menu?restaurantId=${restaurantId}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function fetchRestaurantById(id) {
  const res = await fetch(`${API_URL}/restaurants/${id}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

// 🔥 Favoritos
export async function fetchFavorites() {
  const res = await fetch(`${API_URL}/favorites`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

// ⭐ Top Favoritos
export async function fetchTopFavorites() {
  const res = await fetch(`${API_URL}/favorites/top`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

// 📜 Pedidos
export async function fetchOrders() {
  const res = await fetch(`${API_URL}/orders`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function createOrder(order) {
  const res = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order)
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function updateOrder(id, updates) {
  const res = await fetch(`${API_URL}/orders/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function deleteOrder(id) {
  const res = await fetch(`${API_URL}/orders/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function clearOrders() {
  const res = await fetch(`${API_URL}/orders`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function fetchTracking(orderId) {
  const res = await fetch(`${API_URL}/tracking/${orderId}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}
