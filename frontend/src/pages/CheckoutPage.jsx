import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useToast } from '../context/useToast'
import { createOrder } from '../api'   // ✅ Importa la función centralizada

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState([])
  const { show } = useToast()

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cartItems') || '[]')
    setCartItems(storedCart)
  }, [])

  const total = cartItems.reduce((sum, item) => sum + item.price, 0)

  // 🔹 Confirmar pedido
  const confirmOrder = async () => {
    if (cartItems.length === 0) {
      show('⚠️ No hay productos en el carrito', 'info', 2500)
      return
    }

    const order = {
      items: cartItems,
      total,
      date: new Date().toLocaleString(),
      status: 'Pendiente'
    }

    try {
      const savedOrder = await createOrder(order)   // ✅ Usa la función de api.js
      show(`✅ Pedido #${savedOrder.id} confirmado en servidor`, 'success', 3000)

      localStorage.removeItem('cartItems')
      setCartItems([])
    } catch (err) {
      console.error(err)
      show('❌ Error al guardar pedido en servidor', 'error', 3000)
    }
  }

  // 🔹 Vaciar carrito completo
  const clearCart = () => {
    localStorage.removeItem('cartItems')
    setCartItems([])
    show('🗑️ Carrito vaciado', 'info', 2500)
  }

  // 🔹 Eliminar producto específico
  const removeItem = (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index)
    setCartItems(updatedCart)
    localStorage.setItem('cartItems', JSON.stringify(updatedCart))
    show('❌ Producto eliminado del carrito', 'info', 2500)
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '1rem' }}>
      <h1 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Carrito de compras
        {cartItems.length > 0 && (
          <button onClick={clearCart} className="button-clear" title="Vaciar carrito">
            🗑️
          </button>
        )}
      </h1>

      <Link to="/" className="link">← Volver a restaurantes</Link>

      {cartItems.length === 0 ? (
        <p style={{ marginTop: '1rem', color: '#666' }}>Tu carrito está vacío.</p>
      ) : (
        <div style={{ marginTop: '1rem', display: 'grid', gap: '0.75rem' }}>
          {cartItems.map((item, index) => (
            <div key={index} className="card" style={{ position: 'relative' }}>
              <button
                onClick={() => removeItem(index)}
                className="button-remove"
                title="Eliminar producto"
              >
                ❌
              </button>

              <h2>{item.name}</h2>
              <p style={{ marginTop: '0.25rem', color: '#666' }}>{item.description}</p>
              <p><strong>Lps {item.price.toFixed(2)}</strong></p>
            </div>
          ))}
          <p style={{ fontSize: '1.2rem', marginTop: '1rem' }}>
            Total: <strong>Lps {total.toFixed(2)}</strong>
          </p>
          <button onClick={confirmOrder} className="button-confirm">
            Confirmar pedido
          </button>
        </div>
      )}
    </div>
  )
}
