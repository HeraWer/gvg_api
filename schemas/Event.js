/*
 *  Author: Joan Gómez
 *  Fecha: 18/3/20
*/

// imports
const mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Esquemas donde se mapea sobre las collections de mongo atlas

/*
const Event = mongoose.Schema({
    id: {type: String},
    schedule: {type: Number},
    location: {type: String},
    description: {type: String},
    avaliableStaff: {type: String},
    active: {type: Boolean},
}, {versionKey: false});
*/
/*
const Event = mongoose.Schema({
    //id: {type: String},
    //schedule: {type: Number},
    //location: {type: String},
    description: {type: String},
    //avaliableStaff: {type: String},
    //active: {type: Boolean},
}, {versionKey: false});
*/

var eventSchema = mongoose.Schema ({
	number: {type: Number},
    publisher: {type: Schema.Types.ObjectId, ref: 'User'},
    type: {type: String},
    title: {type: String},
    description: {type: String},
    date_published: {type: Date},
	active: {type: Boolean},
	staffs: [{type: Schema.Types.ObjectId, ref: 'User'}],
	seats: {type: Number},
	location: {type: Schema.Types.ObjectId, ref: 'Location'},
	schedule: [{day: String, hour_start: String, hour_end: String}]
});

module.exports = mongoose.model("Event", eventSchema);