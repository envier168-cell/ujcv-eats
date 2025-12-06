import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useToast } from '../context/useToast'
import { fetchOrders, updateOrder, deleteOrder, clearOrders } from '../api'  // ✅ Importa funciones

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState('Todos')
  const { show } = useToast()

  useEffect(() => {
    fetchOrders()
      .then(setOrders)
      .catch(() => setOrders([]))
  }, [])

  const repeatOrder = (order) => {
    localStorage.setItem('cartItems', JSON.stringify(order.items))
    localStorage.setItem('selectedRestaurant', JSON.stringify(order.restaurant))
    show(`🔄 Pedido #${order.id} agregado nuevamente al carrito`, 'info', 2500)
  }

  const updateStatus = async (id, newStatus) => {
    try {
      const updated = await updateOrder(id, { status: newStatus })
      setOrders(orders.map(o => o.id === id ? updated : o))
      show(`📦 Pedido #${id} marcado como ${newStatus}`, 'success', 2500)
    } catch (err) {
      console.error(err)
      show('❌ Error al actualizar pedido', 'error', 2500)
    }
  }

  const deleteOrderHandler = async (id) => {
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
    try {
      await clearOrders()
      setOrders([])
      show('🗑️ Historial de pedidos borrado completamente', 'info', 2500)
    } catch (err) {
      console.error(err)
      show('❌ Error al borrar historial', 'error', 2500)
    }
  }

  const filteredOrders = filter === 'Todos'
    ? orders
    : orders.filter(order => order.status === filter)

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '1rem', position: 'relative' }}>
      <h1 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Historial de pedidos
        <button onClick={clearAllOrdersHandler} className="button-clear" title="Borrar todo el historial">
          🗑️
        </button>
      </h1>

      <Link to="/" className="link">← Volver a restaurantes</Link>

      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
        {['Todos', 'Pendiente', 'Entregado', 'Cancelado'].map(state => (
          <button
            key={state}
            onClick={() => setFilter(state)}
            className={`button-filter ${filter === state ? 'active' : ''}`}
          >
            {state}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <p style={{ marginTop: '1rem', color: '#666' }}>No hay pedidos en este estado.</p>
      ) : (
        <div style={{ marginTop: '1rem', display: 'grid', gap: '1rem' }}>
          {filteredOrders.map(order => (
            <div key={order.id} className="order-card">
              <button
                onClick={() => deleteOrderHandler(order.id)}
                className="button-remove"
                title="Eliminar este pedido"
              >
                🗑️
              </button>

              <h2>Pedido #{order.id}</h2>
              <p style={{ marginTop: '0.25rem', color: '#666' }}>
                Restaurante: <strong>{order.restaurant?.name ?? 'Desconocido'}</strong>
              </p>
              <p>Fecha: {order.date}</p>
              <p>
                Estado: <span className={`order-status ${
                  order.status === 'Pendiente' ? 'pending' :
                  order.status === 'Entregado' ? 'delivered' : 'cancelled'
                }`}>
                  {order.status}
                </span>
              </p>
              <ul style={{ marginTop: '0.5rem' }}>
                {order.items.map((item, i) => (
                  <li key={i}>{item.name} — Lps {item.price.toFixed(2)}</li>
                ))}
              </ul>
              <p style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>
                Total: Lps {order.total.toFixed(2)}
              </p>
              <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => repeatOrder(order)} className="button-repeat">
                  🔄 Repetir pedido
                </button>
                <button onClick={() => updateStatus(order.id, 'Entregado')} className="button-delivered">
                  ✅ Marcar entregado
                </button>
                <button onClick={() => updateStatus(order.id, 'Cancelado')} className="button-cancel">
                  ❌ Cancelar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
