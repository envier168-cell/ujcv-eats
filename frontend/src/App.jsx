import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import SplashScreen from './components/SplashScreen'

// Páginas principales
import HomePage from './pages/HomePage'
import UserInfoPage from './pages/UserInfoPage'
import CheckoutPage from './pages/CheckoutPage'
import OrdersPage from './pages/OrdersPage'
import TopFavoritesPage from './pages/TopFavoritesPage'
import TrackingPage from './pages/TrackingPage'
import MenuPage from './pages/MenuPage'
import OrderConfirmation from './pages/OrderConfirmation'
import AdminFavoritesPage from './pages/AdminFavoritesPage'

// 🔹 Nuevas páginas de autenticación
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

export default function App() {
  const [loading, setLoading] = useState(true)

  return (
    <>
      {loading ? (
        <SplashScreen onFinish={() => setLoading(false)} />
      ) : (
        <Routes>
          {/* Página de inicio */}
          <Route path="/" element={<HomePage />} />

          {/* Información del usuario */}
          <Route path="/usuario" element={<UserInfoPage />} />

          {/* Carrito y confirmación de pedidos */}
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />

          {/* Historial de pedidos */}
          <Route path="/orders" element={<OrdersPage />} />

          {/* Más pedidos esta semana */}
          <Route path="/top" element={<TopFavoritesPage />} />

          {/* Seguimiento de pedido */}
          <Route path="/tracking" element={<TrackingPage />} />

          {/* Menús de restaurantes */}
          <Route path="/menu/:id" element={<MenuPage />} />

          {/* Favoritos del administrador */}
          <Route path="/admin-favorites" element={<AdminFavoritesPage />} />

          {/* 🔹 Autenticación */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      )}
    </>
  )
}
