import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useToast } from '../context/useToast'
import { createOrder } from '../api'

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState([])
  const { show } = useToast()

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cartItems') || '[]')
    setCartItems(storedCart)
  }, [])

  const total = cartItems.reduce((sum, item) => sum + item.price, 0)

  // Confirmar pedido
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
      const savedOrder = await createOrder(order)
      show(`✅ Pedido #${savedOrder.id} confirmado en servidor`, 'success', 3000)

      localStorage.removeItem('cartItems')
      setCartItems([])
    } catch (err) {
      console.error(err)
      show('❌ Error al guardar pedido en servidor', 'error', 3000)
    }
  }

  // Vaciar carrito completo
  const clearCart = () => {
    localStorage.removeItem('cartItems')
    setCartItems([])
    show('🗑️ Carrito vaciado', 'info', 2500)
  }

  // Eliminar producto específico
  const removeItem = (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index)
    setCartItems(updatedCart)
    localStorage.setItem('cartItems', JSON.stringify(updatedCart))
    show('❌ Producto eliminado del carrito', 'info', 2500)
  }

  return (
    <div className="cart-container">
      <h1 className="cart-title">
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
            <div key={index} className="cart-item">
              {/* ❌ botón para eliminar producto */}
              <button
                onClick={() => removeItem(index)}
                className="button-remove"
                title="Eliminar producto"
              >
                ❌
              </button>

              {/* Producto */}
              <h2 className="cart-item-name">{item.name}</h2>
              <p className="cart-item-description">{item.description}</p>

              {/* Restaurante */}
              {item.restaurant && (
                <p className="cart-item-restaurant">
                  Restaurante: <strong>{item.restaurant}</strong>
                </p>
              )}

              {/* Precio individual */}
              <p className="cart-item-price">Lps {item.price.toFixed(2)}</p>
            </div>
          ))}

          {/* Total general */}
          <p className="cart-total">
            Total: <strong>Lps {total.toFixed(2)}</strong>
          </p>

          {/* Confirmar pedido */}
          <button onClick={confirmOrder} className="cart-confirm-button">
            Confirmar pedido
          </button>
        </div>
      )}
    </div>
  )
}
