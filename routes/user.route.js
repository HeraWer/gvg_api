const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
require("dotenv").config();

const multer = require('multer');
var upload = multer({ dest: 'uploads/' })
const bodyParser = require('body-parser');
const path = require('path');
require("dotenv").config();
var fs = require('fs');
const stream = require('stream');

var userLogged;

const User = require("../schemas/User");
const Event = require("../schemas/Event");
const Role = require("../schemas/Role");
const Location = require("../schemas/Location");
const Message = require("../schemas/Message");

var storage = multer.diskStorage(
    {
        destination: 'uploads/',
        filename: function ( req, file, cb ) {
            //req.body is empty...
            //How could I get the new_file_name property sent from client here?
            cb(null,userLogged+".png");
        }
    }
);

upload = multer({ storage: storage })

router.post('/setPhoto', upload.single('avatar'), function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  
  //console.log(req.file);
  //writeFile(req.file);
});

router.get("/getPhoto", async(req, res) => {
    User.findOne({username: req.body.username})
    .select('photo')
    .then(result => {
        console.log(result);
        var photo = JSON.stringify(result);
        var photo2 = JSON.parse(photo);
        res.send(JSON.parse('{"photo":"'+photo2+'"}'));
    })
});

router.get("/allUsers", async (req, res) => {
    User.find().then(result => {
        res.send(result);
    })
});

router.get("/allRoles", async (req, res) => {
    Role.find().then(result => {
        res.send(result);
    })
});

router.post("/getUser", async (req, res) => {
    User.findOne({username: req.body.username}).then(result => {
        console.log(result);
        res.send(result);
    })
});

router.post("/login", async (req, res) => {
    var loginUser = ({
        username: req.body.username,
        password: req.body.password
    })

    console.log(loginUser.username);
    console.log(loginUser.password);

    var token = jwt.sign(loginUser.username, process.env.SECRETO);
    var message = "Este usuario no existe en la base de datos";

    User.findOne(loginUser).then(result => {

        if(result) {
            res.send(JSON.parse('{"token":"'+token+'"}'));
        }else {
            res.send(JSON.parse('{"message":"'+message+'"}'));
        }
    })

});

router.post("/newUser", (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });
    
    user
        .save()
        .then(result => {
            res.send("Usuario creado correctamente");
        })
        .catch(err => {
            res.send("No se a podido crear el usuario");
        });
});

router.delete("/deleteUser", async (req, res) => {
    User.deleteOne({username: req.body.username}).then(result => {
        res.send("Usuario eliminado correctamente");
    })
});

router.post("/updateUser", async (req, res) => {
    User.findOneAndUpdate({username: req.body.username}, {password: req.body.password}).then(result => {
        res.send("Usuario modificado correctamente")
    })
});

router.get("/allEvents", async (req, res) => {
    Event.find().then(result => {
        res.send(result);
    })
});


module.exports = router;