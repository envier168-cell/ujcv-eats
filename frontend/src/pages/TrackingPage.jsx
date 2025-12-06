import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchTracking } from '../api'  // ✅ Importa la función

export default function TrackingPage() {
  const [tracking, setTracking] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchTracking(12345)   // 👈 Usa la función centralizada
      .then(data => {
        setTracking(data)
        setError(null)
      })
      .catch(err => {
        console.error('Error cargando tracking:', err)
        setError('No se pudo cargar el seguimiento')
      })
  }, [])

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '1rem' }}>
      <Link to="/" className="link" style={{ display: 'inline-block', marginBottom: '1rem' }}>
        ← Volver al menú principal
      </Link>

      <h1>🍽️ Seguimiento de pedido</h1>

      {error && <p style={{ color: '#c00' }}>{error}</p>}
      {!tracking && !error && <p>Cargando seguimiento...</p>}

      {tracking && (
        <>
          <div className="progress-container">
            <div className="progress-emojis">
              {tracking.progress.map((emoji, i) => (
                <div key={i}><span>{emoji}</span></div>
              ))}
            </div>
            <div className="progress-bar">
              {tracking.progress.map((_, i) => (
                <div
                  key={i}
                  className={`progress-step ${
                    i === 0 ? 'yellow' : i === 1 ? 'blue' : 'green'
                  }`}
                />
              ))}
            </div>
          </div>

          <p style={{ fontWeight: 'bold', color: '#333', marginBottom: '0.75rem' }}>
            ⏱️ Tiempo estimado: {tracking.etaMinutes} minutos
          </p>

          <div className="delivery-card">
            <h3>🛵 Repartidor</h3>
            <p><strong>Nombre:</strong> {tracking.deliveryPerson.name}</p>
            <p><strong>Teléfono:</strong> {tracking.deliveryPerson.phone}</p>
            <p><strong>Vehículo:</strong> {tracking.deliveryPerson.vehicle}</p>
          </div>
        </>
      )}
    </div>
  )
}
