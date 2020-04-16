/*
 *  Author: Joan Gómez
 *  Fecha: 18/3/20
*/

// imports
const mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Esquemas donde se mapea sobre las collections de mongo atlas

var eventSchema = mongoose.Schema ({
	number: {type: Number},
    publisher: {type: String},
    type: {type: String},
    title: {type: String},
    description: {type: String},
    date_published: {type: Date, default: Date.now},
	active: {type: Boolean},
	staffs: [{type: Schema.Types.ObjectId, ref: 'User'}],
	seats: {type: Number},
	location: {
        longitude: {type: String},
        latitude: {type: String},
        city: {type: String},
        postal_code: {type: String},
        address: {type: String}
    },
	schedule: [{day: String, hour_start: String, hour_end: String}]
});

module.exports = mongoose.model("Event", eventSchema);