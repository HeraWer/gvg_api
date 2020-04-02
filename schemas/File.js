// imports
const mongoose = require("mongoose");
var Schema = mongoose.Schema;
var filePluginLib = require('mongoose-file');
var filePlugin = filePluginLib.filePlugin;
var make_upload_to_model = filePluginLib.make_upload_to_model;

var fileSchema = mongoose.Schema ({
    length: Number,
    chunkSize: Number,
    uploadDate: Date,
    filename: String,
    md5: String,
    contentType: String,
    aliases: [{
    
    }]
});


module.exports = mongoose.model("File", userSchema);