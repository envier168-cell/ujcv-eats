const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

app.get('/restaurants', (req, res) => {
  res.json([
    { id: 1, name: 'Burger King Comayagua', address: 'Boulevard Roberto Romero Larios, Comayagua' },
    { id: 2, name: 'McDonald\'s Comayagua', address: 'Centro Comercial Mall Premier, Comayagua' },
    { id: 3, name: 'Pizza Hut Comayagua', address: 'Barrio La Caridad, Comayagua' }
  ])
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`)
})
