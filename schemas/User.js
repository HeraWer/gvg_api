// imports
const mongoose = require("mongoose");
var Schema = mongoose.Schema;
var filePluginLib = require('mongoose-file');
var filePlugin = filePluginLib.filePlugin;
var make_upload_to_model = filePluginLib.make_upload_to_model;

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
    photo: String,
    role: {
        role_name: String
    },
    active: {type: Boolean},
    unavailability: {type: Boolean}
});



module.exports = mongoose.model("User", userSchema);
