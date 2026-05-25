const mongoose = require('mongoose')

const jogoSchema = new mongoose.Schema({
    _id:                { type: String },
    id:                 { type: String, required: true },
    name:               { type: String, required: true },
    year:               { type: Number, required: true },
    category:           { type: String, required: true },
    minPlayers:         { type: Number },
    maxPlayers:         { type: Number },
    playingTimeMinutes: { type: Number },
    descriptionEN:      { type: String },
    autores:   [{ id: String, name: String }],
    editoras:  [{ id: String, name: String, country: String }],
    mecanicas: [{ id: String, name: String }],
    premios:   [{ id: String, name: String, year: Number }]
})

module.exports = mongoose.model('Jogo', jogoSchema, 'jogos')
