const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
require("dotenv").config();

var Grid = require('gridfs-stream');
var GridFsStorage = require('multer-gridfs-storage');
const mongoose = require('mongoose');
var mongo = require('mongodb');
var Grid = require('gridfs-stream');
const index = require("../index");
const multer = require('multer');
var upload = multer({ dest: 'uploads/' })
const bodyParser = require('body-parser');
const path = require('path');
require("dotenv").config();
var fs = require('fs');
const { Readable } = require('stream');
Grid.mongo = mongoose.mongo;
var gfs = new Grid("Intercruises",mongoose.mongo);
//writeStream,
//readStream,
buffer = "";
const { createReadStream } = require('fs');
const { createModel } = require('mongoose-gridfs');

var userLogged;

const User = require("../schemas/User");
const Event = require("../schemas/Event");
const Role = require("../schemas/Role");
const Location = require("../schemas/Location");
const Message = require("../schemas/Message");

// Conexion a la base de datos.
const url = "mongodb+srv://" + process.env.atlasUsername + ":" + process.env.atlasPassword + "@projectintercruises-gpdno.mongodb.net/intercruises?retryWrites=true&w=majority";

var conn = mongoose
.connect(process.env.MONGODB_URI || url , {
  useNewUrlParser: true,
  useUnifiedTopology: true
},
()=> {
  console.log("connected to database!")
  gfs = new Grid(mongoose.connection.db, mongoose.mongo);
})
.catch((err) => {
  console.log("No ha podido conectarse a la base de datos");
  throw err;
});


// Custom bucket para definir ruta archivo y nombre
var storage = multer.diskStorage(
  {
    destination: 'uploads/',
    filename: function ( req, file, cb ) {
      //req.body is empty...
      //How could I get the new_file_name property sent from client here?
      cb(null,userLogged+".png");
    }
  });

  upload = multer({ storage: storage })

  function writeFile () {
    // use default bucket
    const Attachment = createModel();
    // write file to gridfs
    console.log(userLogged);
    const readStream = createReadStream("uploads/"+userLogged+".png");
    const options = ({ filename: userLogged+".png", contentType: 'image/png' });
    Attachment.write(options, readStream, (error, file) => {
      //=> {_id: ..., filename: ..., ...}
    });
  }

  function readFile () {


  }

  /*
  --------------------------------------------- AJAX METHODS -------------------------------------------------------------------
  */

  router.post('/setPhoto', upload.single('avatar'), function (req, res, next) {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
    writeFile(req.file);
  });

  router.get("/getPhoto", async(req, res) => {
    var db = new mongo.Db('Intercruises', new mongo.Server(url));  //if you are using mongoDb directily
    var gfs = Grid(db,mongo);
    var rstream = gfs.createReadStream(userLogged+".png");
    var bufs = [];
    rstream.on('data', function (chunk) {
      bufs.push(chunk);
    }).on('error', function () {
      res.send();
    })
    .on('end', function () { // done

      var fbuf = Buffer.concat(bufs);

      var File = (fbuf.toString('base64'));

      res.send(File);

    });
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
        userLogged = loginUser.username;
        res.send(JSON.parse('{"token":"'+token+'"}'));
      }else {
        res.send(JSON.parse('{"message":"'+message+'"}'));
      }
    })

  });

  router.post("/newUser", (req, res) => {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
      name: req.body.name,
      lastname: req.body.lastname,
      DNI: req.body.dni,
      birthdate: req.body.birthdate,
      location: {
        city: req.body.location.city,
        adress: req.body.location.address
      },
      //        photo: req.body.photo.data,
      role: req.body.role,
      active: req.body.active,
      unavailability: req.body.unavailability
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

  router.get("/allEvents", async (req, res) => {
    Event.find().then(result => {
      res.send(result);
    })
  });


  module.exports = router;
