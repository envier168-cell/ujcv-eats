import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { createOrder } from '../api'   // ✅ Importa la función

export default function OrderConfirmation() {
  useEffect(() => {
    // Recuperar datos del carrito y restaurante seleccionados
    const items = JSON.parse(localStorage.getItem('cartItems') || '[]')
    const restaurant = JSON.parse(localStorage.getItem('selectedRestaurant') || '{}')

    if (items.length > 0 && restaurant.id) {
      const newOrder = {
        restaurant,
        items,
        date: new Date().toLocaleString(),
        status: 'Pendiente'
      }

      createOrder(newOrder)
        .then(saved => {
          console.log('Pedido guardado en backend:', saved)
          // Limpia el carrito después de guardar
          localStorage.removeItem('cartItems')
          localStorage.removeItem('selectedRestaurant')
        })
        .catch(err => {
          console.error('❌ Error al guardar pedido:', err)
        })
    }
  }, [])

  return (
    <div className="max-w-2xl mx-auto p-10 text-center">
      <h1 className="text-3xl font-semibold text-green-600">✅ ¡Gracias por tu pedido!</h1>
      <p className="text-lg mt-4">
        Tu orden ha sido enviada correctamente. En breve será procesada por el restaurante.
      </p>
      <div className="flex items-center justify-center gap-6 mt-8">
        <Link to="/" className="text-blue-600 hover:underline">← Volver a restaurantes</Link>
        <Link to="/orders" className="text-blue-600 hover:underline">📜 Ver historial de pedidos</Link>
      </div>
    </div>
  )
}
