/*
 *  Author: Joan Gómez
 *  Fecha: 18/3/20
*/

// imports
const mongoose = require("mongoose");

// Esquemas donde se mapea sobre las collections de mongo atlas
const Event = mongoose.Schema({
    id: {type: String},
    schedule: {type: Number},
    location: {type: String},
    description: {type: String},
    avaliableStaff: {type: String},
    active: {type: Boolean},
}, {versionKey: false});

module.exports = mongoose.model("Event", Event);