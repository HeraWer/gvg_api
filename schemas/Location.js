const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var locationSchema = mongoose.Schema({
    longitude: {type: String},
    latitude: {type: String},
    city: {type: String},
    postal_code: {type: String},
    address: {type: String}
});


module.exports = mongoose.model("Location", locationSchema);