const express = require('express')
const router = express.Router()
const jogoController = require('../controllers/jogoController')

router.get('/',           jogoController.getJogos)
router.get('/:id',        jogoController.getJogoById)
router.post('/',          jogoController.createJogo)
router.put('/:id',        jogoController.updateJogo)
router.delete('/:id',     jogoController.deleteJogo)

module.exports = router
