const express = require('express')
const router = express.Router()
const livroController = require('../controllers/livroController')

router.get('/',     livroController.getLivros)
router.post('/',    livroController.createLivro)
router.put('/:id',  livroController.updateLivro)
router.delete('/:id', livroController.deleteLivro)

module.exports = router
