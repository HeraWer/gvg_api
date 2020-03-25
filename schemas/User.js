/*
 *  Author: Jonatan Valle Corrales
 *  Fecha: 2/3/20
 *  Email: vallejestudiante@gmail.com
*/

// imports
const mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Esquemas donde se mapea sobre las collections de mongo atlas
/*const User = mongoose.Schema({
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
}, {versionKey: false});*/

var userSchema = mongoose.Schema ({
    username: String,
    password: String,
    name: String,
    lastname: String,
    DNI: String,
    birthdate: String,
    location: {
        longitude: String,
        latitude: String,
        city: String,
        postal_code: String,
        adress: String
    },
  //  photo: {type: Buffer},
    role: {type: String},
    active: {type: Boolean},
    unavailability: {type: Boolean}
});



module.exports = mongoose.model("User", userSchema);
