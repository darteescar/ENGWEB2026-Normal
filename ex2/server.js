const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 19020
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/leituras'

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
    const d = new Date().toISOString().substring(0, 16)
    console.log(`${req.method} ${req.url} ${d}`)
    next()
})

const livroRoutes = require('./routes/livroRoutes')
app.use('/api/livros', livroRoutes)

mongoose.connect(MONGO_URL)
    .then(async () => {
        console.log('MongoDB conectado: leituras')
        const Livro = require('./models/Livro')
        const count = await Livro.countDocuments()
        if (count === 0) {
            const dataset = require('./data/dataset.json')
            await Livro.insertMany(dataset)
            console.log(`Dataset carregado: ${dataset.length} livros inseridos.`)
        }
    })
    .catch(err => console.error('Erro ao conectar ao MongoDB:', err))

app.listen(PORT, () => {
    console.log(`API a correr em http://localhost:${PORT}`)
    console.log('Rotas disponíveis:')
    console.log('  GET    /api/livros')
    console.log('  GET    /api/livros?search=X')
    console.log('  POST   /api/livros')
    console.log('  PUT    /api/livros/:id')
    console.log('  DELETE /api/livros/:id')
})
