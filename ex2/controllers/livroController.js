const Livro = require('../models/Livro')

// GET /api/livros?search=X
exports.getLivros = async (req, res) => {
    try {
        const { search } = req.query
        const query = search
            ? { $or: [
                { titulo: { $regex: search, $options: 'i' } },
                { autor:  { $regex: search, $options: 'i' } }
              ]}
            : {}
        const livros = await Livro.find(query)
        res.json(livros)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// POST /api/livros
exports.createLivro = async (req, res) => {
    try {
        const { titulo, autor, paginas, genero } = req.body
        const livro = new Livro({ titulo, autor, paginas, genero })
        await livro.save()
        res.status(201).json(livro)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// PUT /api/livros/:id  — altera apenas o campo lido
exports.updateLivro = async (req, res) => {
    try {
        const livro = await Livro.findByIdAndUpdate(
            req.params.id,
            { lido: req.body.lido },
            { new: true }
        )
        if (!livro) return res.status(404).json({ message: 'Livro não encontrado.' })
        res.json(livro)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// DELETE /api/livros/:id
exports.deleteLivro = async (req, res) => {
    try {
        const livro = await Livro.findByIdAndDelete(req.params.id)
        if (!livro) return res.status(404).json({ message: 'Livro não encontrado.' })
        res.json({ message: 'Livro removido com sucesso.' })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}
