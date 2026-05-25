const Jogo = require('../models/Jogo')

// GET /jogos  ou  GET /jogos?editora=EEEE
exports.getJogos = async (req, res) => {
    try {
        const { editora } = req.query

        if (editora) {
            const jogos = await Jogo.find(
                { $or: [{ 'editoras.name': editora }, { 'editoras.id': editora }] },
                { id: 1, name: 1, year: 1, _id: 1 }
            )
            return res.json(jogos)
        }

        const jogos = await Jogo.find({}, { id: 1, name: 1, year: 1, category: 1, minPlayers: 1, _id: 1 })
        res.json(jogos)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// GET /jogos/:id
exports.getJogoById = async (req, res) => {
    try {
        const jogo = await Jogo.findById(req.params.id)
        if (!jogo) return res.status(404).json({ message: 'Jogo não encontrado.' })
        res.json(jogo)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// GET /autores
exports.getAutores = async (req, res) => {
    try {
        const result = await Jogo.aggregate([
            { $unwind: '$autores' },
            { $group: {
                _id: '$autores.id',
                name: { $first: '$autores.name' },
                jogos: { $push: { id: '$_id', name: '$name' } }
            }},
            { $sort: { name: 1 } },
            { $project: { _id: 0, name: 1, jogos: 1 } }
        ])
        res.json(result)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// GET /categorias
exports.getCategorias = async (req, res) => {
    try {
        const result = await Jogo.aggregate([
            { $group: {
                _id: '$category',
                jogos: { $push: { id: '$_id', name: '$name' } }
            }},
            { $sort: { _id: 1 } },
            { $project: { _id: 0, categoria: '$_id', jogos: 1 } }
        ])
        res.json(result)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// POST /jogos
exports.createJogo = async (req, res) => {
    try {
        const jogo = new Jogo({ _id: req.body.id, ...req.body })
        await jogo.save()
        res.status(201).json(jogo)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// PUT /jogos/:id
exports.updateJogo = async (req, res) => {
    try {
        const jogo = await Jogo.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!jogo) return res.status(404).json({ message: 'Jogo não encontrado.' })
        res.json(jogo)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// DELETE /jogos/:id
exports.deleteJogo = async (req, res) => {
    try {
        const jogo = await Jogo.findByIdAndDelete(req.params.id)
        if (!jogo) return res.status(404).json({ message: 'Jogo não encontrado.' })
        res.json({ message: 'Jogo eliminado com sucesso.' })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}
