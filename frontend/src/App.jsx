import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import SplashScreen from './components/SplashScreen'
import { useAuth } from './context/AuthContext'   // 🔹 Importa el contexto

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

// Autenticación
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

// Rutas privadas
import PrivateRoute from './routes/PrivateRoute'

export default function App() {
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()   // 🔹 obtenemos el usuario del contexto

  return (
    <>
      {loading ? (
        <SplashScreen onFinish={() => setLoading(false)} />
      ) : (
        <Routes>
          {/* 🔹 Ruta raíz: si no hay usuario, redirige a login */}
          <Route
            path="/"
            element={user ? <HomePage /> : <Navigate to="/login" replace />}
          />

          {/* Información del usuario (privada) */}
          <Route
            path="/usuario"
            element={
              <PrivateRoute>
                <UserInfoPage />
              </PrivateRoute>
            }
          />

          {/* Carrito y confirmación de pedidos (privadas) */}
          <Route
            path="/checkout"
            element={
              <PrivateRoute>
                <CheckoutPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/order-confirmation"
            element={
              <PrivateRoute>
                <OrderConfirmation />
              </PrivateRoute>
            }
          />

          {/* Historial de pedidos (privada) */}
          <Route
            path="/orders"
            element={
              <PrivateRoute>
                <OrdersPage />
              </PrivateRoute>
            }
          />

          {/* Más pedidos esta semana (privada) */}
          <Route
            path="/top"
            element={
              <PrivateRoute>
                <TopFavoritesPage />
              </PrivateRoute>
            }
          />

          {/* Seguimiento de pedido (privada) */}
          <Route
            path="/tracking"
            element={
              <PrivateRoute>
                <TrackingPage />
              </PrivateRoute>
            }
          />

          {/* Menús de restaurantes (privada) */}
          <Route
            path="/menu/:id"
            element={
              <PrivateRoute>
                <MenuPage />
              </PrivateRoute>
            }
          />

          {/* Favoritos del administrador (privada) */}
          <Route
            path="/admin-favorites"
            element={
              <PrivateRoute>
                <AdminFavoritesPage />
              </PrivateRoute>
            }
          />

          {/* Autenticación (públicas) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      )}
    </>
  )
}
