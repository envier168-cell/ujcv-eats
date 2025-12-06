import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useToast } from '../context/useToast'

export default function AdminFavoritesPage() {
  const [favorites, setFavorites] = useState([])
  const [newFavorite, setNewFavorite] = useState({ name: '', description: '', price: '' })
  const { show } = useToast()

  // Cargar favoritos
  useEffect(() => {
    fetch('http://localhost:3000/favorites')
      .then(res => res.json())
      .then(setFavorites)
      .catch(() => setFavorites([]))
  }, [])

  // Agregar favorito
  const handleAdd = () => {
    if (!newFavorite.name || !newFavorite.description || !newFavorite.price) {
      show('⚠️ Completa todos los campos', 'warning')
      return
    }

    const favoriteToAdd = {
      ...newFavorite,
      id: Math.floor(1000 + Math.random() * 9000),
      price: parseFloat(newFavorite.price)
    }

    fetch('http://localhost:3000/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(favoriteToAdd)
    })
      .then(() => {
        setFavorites([...favorites, favoriteToAdd])
        setNewFavorite({ name: '', description: '', price: '' })
        show('✅ Favorito agregado con éxito', 'success')
      })
      .catch(() => show('❌ Error al agregar favorito', 'error'))
  }

  // Eliminar favorito
  const handleDelete = (id) => {
    fetch(`http://localhost:3000/favorites/${id}`, { method: 'DELETE' })
      .then(() => {
        setFavorites(favorites.filter(f => f.id !== id))
        show('🗑️ Favorito eliminado', 'warning')
      })
      .catch(() => show('❌ Error al eliminar favorito', 'error'))
  }

  return (
    <div className="container">
      <h1 className="h1">⚙️ Administración de Favoritos</h1>
      <Link to="/" className="link">← Volver al inicio</Link>

      {/* Formulario para agregar */}
      <div className="card section">
        <h2 className="h2">Agregar nuevo favorito</h2>
        <input
          type="text"
          placeholder="Nombre"
          value={newFavorite.name}
          onChange={(e) => setNewFavorite({ ...newFavorite, name: e.target.value })}
          className="input section"
        />
        <input
          type="text"
          placeholder="Descripción"
          value={newFavorite.description}
          onChange={(e) => setNewFavorite({ ...newFavorite, description: e.target.value })}
          className="input section"
        />
        <input
          type="number"
          placeholder="Precio"
          value={newFavorite.price}
          onChange={(e) => setNewFavorite({ ...newFavorite, price: e.target.value })}
          className="input section"
        />
        <button onClick={handleAdd} className="btn btn-success">Agregar</button>
      </div>

      {/* Lista de favoritos */}
      <div className="section">
        <h2 className="h2">Favoritos actuales</h2>
        {favorites.length === 0 ? (
          <p className="muted">No hay favoritos registrados.</p>
        ) : (
          favorites.map(item => (
            <div key={item.id} className="card section">
              <h3 className="h3">{item.name}</h3>
              <p className="muted">{item.description}</p>
              <p><strong>Lps {item.price.toFixed(2)}</strong></p>
              <button 
                onClick={() => handleDelete(item.id)} 
                className="btn btn-danger"
              >
                Eliminar
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
