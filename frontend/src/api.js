const API_URL = import.meta.env.VITE_API_URL
console.log('API_URL en runtime:', API_URL)

// 🏠 Restaurantes
export async function fetchRestaurants() {
  const res = await fetch(`${API_URL}/api/restaurants`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function fetchMenu(restaurantId) {
  const res = await fetch(`${API_URL}/api/menu?restaurantId=${restaurantId}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function fetchRestaurantById(id) {
  const res = await fetch(`${API_URL}/api/restaurants/${id}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

// 🔥 Top favoritos
export async function fetchTopFavorites() {
  const res = await fetch(`${API_URL}/api/top-favorites`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

// 📜 Pedidos
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

export async function clearOrders() {
  const res = await fetch(`${API_URL}/api/orders`, { method: 'DELETE' })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

// 🚚 Seguimiento de pedido
export async function fetchTracking(orderId) {
  const res = await fetch(`${API_URL}/api/tracking/${orderId}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}
