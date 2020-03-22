const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var roleSchema = mongoose.Schema({
    //role_name: {type: String}
});


module.exports = mongoose.model("Role", roleSchema);