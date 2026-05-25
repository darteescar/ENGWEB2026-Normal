const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 17000
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/jogostabuleiro'

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Logger
app.use((req, res, next) => {
    const d = new Date().toISOString().substring(0, 16)
    console.log(`${req.method} ${req.url} ${d}`)
    next()
})

// Swagger
const swaggerDoc = YAML.load(path.join(__dirname, 'swagger.yaml'))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc))

// Rotas
const jogoRoutes = require('./routes/jogoRoutes')
const jogoController = require('./controllers/jogoController')
app.use('/jogos', jogoRoutes)
app.get('/autores', jogoController.getAutores)
app.get('/categorias', jogoController.getCategorias)

// MongoDB
mongoose.connect(MONGO_URL)
    .then(async () => {
        console.log('MongoDB conectado: jogostabuleiro')

        const Jogo = require('./models/Jogo')
        const count = await Jogo.countDocuments()
        if (count === 0) {
            const dataset = require('./jogos_import.json')
            await Jogo.insertMany(dataset)
            console.log(`Dataset carregado: ${dataset.length} jogos inseridos.`)
        }
    })
    .catch(err => console.error('Erro ao conectar ao MongoDB:', err))

app.listen(PORT, () => {
    console.log(`API a correr em http://localhost:${PORT}`)
    console.log(`Swagger disponível em http://localhost:${PORT}/api-docs/`)
    console.log('')
    console.log('Rotas disponíveis:')
    console.log('  GET    /jogos')
    console.log('  GET    /jogos?editora=EEEE')
    console.log('  GET    /jogos/:id')
    console.log('  GET    /autores')
    console.log('  GET    /categorias')
    console.log('  POST   /jogos')
    console.log('  PUT    /jogos/:id')
    console.log('  DELETE /jogos/:id')
})
