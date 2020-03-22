const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var messageSchema = mongoose.Schema({
    emmiter: {type: Schema.Types.ObjectId, ref: 'User'},
    receiver: {type: Schema.Types.ObjectId, ref: 'User'},
    text: {type: String},
    date: {type: Date}
});


module.exports = mongoose.model("Message", messageSchema);