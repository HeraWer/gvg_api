/*
 *  Author: Jonatan Valle Corrales
 *  Fecha: 2/3/20
 *  Email: vallejestudiante@gmail.com
*/

// imports
const mongoose = require("mongoose");

// Esquemas donde se mapea sobre las collections de mongo atlas
const User = mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    name: {type: String},
    lastname: {type: String},
    DNI: {type: String},
    birthdate: {type: String},
    city: {type: String},
    photo: {type: String},
    role: {type: String},
    active: {type: Boolean},
    unavailability: {type: Boolean}
}, {versionKey: false});

module.exports = mongoose.model("User", User);