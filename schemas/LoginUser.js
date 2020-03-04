/*
 *  Author: Jonatan Valle Corrales
 *  Fecha: 2/3/20
 *  Email: vallejestudiante@gmail.com
*/

// imports
const mongoose = require("mongoose");

// Esquemas donde se mapea sobre las collections de mongo atlas
const Login = mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true}
}, {versionKey: false});

module.exports = mongoose.model("User", Login);