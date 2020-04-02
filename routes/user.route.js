const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
require("dotenv").config();
const bodyParser = require('body-parser');
const rutasProtegidas = express.Router();
var bcrypt = require('bcrypt');
var fs = require('fs'),
  mongo = require('mongodb'),
  gridfs = require('gridfs-stream');
var GridFsStorage = require('multer-gridfs-storage');
const mongoose = require('mongoose');
const index = require("../index");
const multer = require('multer');
var upload = multer({dest: 'uploads/'});
const path = require('path');
require("dotenv").config();
const {Readable} = require('stream');
const {createReadStream} = require('fs');
const {createModel} = require('mongoose-gridfs');

var userLogged;
var refreshTokens = {};
// SALTS of bcrypt (security level)
var BCRYPT_SALT_ROUNDS = 12;

const User = require("../schemas/User");
const Event = require("../schemas/Event");
const Role = require("../schemas/Role");
const Location = require("../schemas/Location");
const Message = require("../schemas/Message");

// Conexion a la base de datos.
const url = "mongodb+srv://" + process.env.atlasUsername + ":" + process.env.atlasPassword + "@projectintercruises-gpdno.mongodb.net/intercruises?retryWrites=true&w=majority";

var conn = mongoose.connect(process.env.MONGODB_URI || url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, () => {
  console.log("connected to database!")
  gfs = gridfs(mongoose.connection.db, mongoose.mongo);

}).catch((err) => {
  console.log("No ha podido conectarse a la base de datos");
  throw err;
});

var app = express();
// Use bodyParser to format JSONs
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

gridfs.mongo = mongoose.mongo;
var connection = mongoose.connection;

// Middleware to set the file's name, destination...
var storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function(req, file, cb) {
    cb(null, userLogged + ".png");
  }
});
// Loading the middleware to Multer
upload = multer({storage: storage})

function writeFile(file) {
  // use default bucket
  const Attachment = createModel();
  // write file to gridfs
  console.log(userLogged);
  const readStream = createReadStream("uploads/" + userLogged + ".png");
  const options = ({
    filename: userLogged + ".png",
    contentType: 'image/png'
  });
  Attachment.write(options, readStream, (error, file) => {
    //=> {_id: ..., filename: ..., ...}
  });
}

/******************************************************************************************************************************
  *-------------------------------------------------------- AJAX METHODS -------------------------------------------------------*
  ******************************************************************************************************************************/

router.post('/setPhoto', upload.single('avatar'), function(req, res, next) {
  console.log('/setPhoto')
  writeFile(req.file);
});

router.post("/getPhoto", async (req, res) => {
  console.log('/getPhoto');
  var gfs = gridfs(connection.db);
  let nombreUsuario = req.body.username;
  console.log('nombreUsuario getPhoto ' + nombreUsuario);
  // Check file exist on MongoDB
  gfs.exist({ filename: (nombreUsuario + ".png") }, function (err, file) {
    if (err || !file) {
      console.log(err)
      res.send('File Not Found');
    } else {
      let bufs = [];
      let buf;
      var readstream = gfs.createReadStream({ filename: (nombreUsuario + ".png") });
      readstream.on('data', function(d) {
        bufs.push(d);
      });
      readstream.on('end', function() {
        buf = Buffer.concat(bufs);
        res.send('data:image/png;base64,' + buf.toString('base64'));
      });
    }
  });
});

router.get("/allUsers", rutasProtegidas, async (req, res) => {
  User.find().then(result => {
    res.send(result);
  })
});

router.get("/allRoles", rutasProtegidas, async (req, res) => {
  Role.find().then(result => {
    res.send(result);
  })
});

router.post("/getUser", rutasProtegidas, async (req, res) => {
  User.findOne({ username: req.body.username }).then(result => {
    res.send(result);
  })
});

router.post("/login", async (req, res) => {
  username = req.body.username;
  password = req.body.password;
  try {
    var user = await User.findOne({ username: username }).exec();
    if (!user) {
      return res.status(400).send({ message: "The username does not exist" });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(400).send({ message: "The password is invalid" });
    }
    const payload = {
      check: true
    };
    const token = jwt.sign(payload, process.env.SECRETO);
    userLogged = username;
    res.json({
      mensaje: 'Autenticación correcta',
      username: username,
      token: token
    });
  } catch (error) {
    res.status(500).send("error: " + error);
  }

});

rutasProtegidas.use((req, res, next) => {
  var token = req.headers['authorization'] || (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'] || req.headers['access-token'] || req.token;

  console.log(token);

  if (token) {
    jwt.verify(token, process.env.SECRETO, (err, decoded) => {
      if (err) {
        return res.json({ mensaje: 'Token invalido' });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    res.send({
      mensaje: 'Token invalido'
    });
  }
});

router.post("/checkToken", rutasProtegidas, (req, res) => {
  var token = req.headers['authorization'] || (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'] || req.headers['access-token'] || req.token;

  if (token) {
    jwt.verify(token, process.env.SECRETO, (err, decoded) => {
      if (err) {
        return res.json({ mensaje: 'Token invalido' });
      } else {
        req.decoded = decoded;
        return res.json({ mensaje: 'Token valido' });
      }
    });
  } else {
    return res.json({ mensaje: 'Token invalido' });
  }
})

router.post("/newUser", rutasProtegidas, (req, res) => {
  password = req.body.password;
  // SALT is level of security (12)
  bcrypt.hash(password, BCRYPT_SALT_ROUNDS).then(function (hashedPassword) {
    password = hashedPassword;
  }).then(function () {
    const user = new User({
      username: req.body.username,
      // Password Encrypted
      password: password,
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

    user.save().then(result => {
      res.send("Usuario creado correctamente");
    })
      .catch(err => {
        res.send("No se a podido crear el usuario");
      });
  }).catch(function (error) {
    console.log("Error in Bcrypt: ");
    console.log(error);
    next();
  });
});

router.delete("/deleteUser", rutasProtegidas, async (req, res) => {
  User.deleteOne({ username: req.body.username }).then(result => {
    res.send("Usuario eliminado correctamente");
  })
});

router.post("/updateUser", async (req, res) => {
  bcrypt.hash(req.body.newPassword, BCRYPT_SALT_ROUNDS).then(function (hashedPassword){
  password = hashedPassword;
  }).then(function(){
    User.findOneAndUpdate({ username: req.body.oldUsername }, { username: req.body.newUsername, password: password }, { new: true }).then(result => {
      res.send(result);
    })
  });
});

router.post("/updatePassword", rutasProtegidas, async(req, res) => {
  console.log("updating password");
  password = req.body.password;
  username = req.body.username;
  // SALT is level of security (12)
  console.log(username +" -- "+password);
  bcrypt.hash(password, BCRYPT_SALT_ROUNDS).then(function (hashedPassword) {
    password = hashedPassword;
  }).then(function () {
      User.findOneAndUpdate({username: username}, {password: password}, {new: true}).then(result => {
      res.send(result);
    })
  }).catch(function (msg) {
    console.log("--ERROR: "+msg);
  });
});

router.get("/allEvents", rutasProtegidas, async (req, res) => {
  // Sort by number DESC
  Event.find({}).sort({'number': -1}).then(result => {
    res.send(result);
  })
});

router.get("/allOffers", rutasProtegidas, async (req, res) => {
  // Filter events to get only work offers
  Event.find({'type':'offer'}).then(result => {
    res.send(result);
  })
});

router.post("/apuntarseAEvent", rutasProtegidas, async (req, res) => {
  console.log(req.body.user);
  Event.findOneAndUpdate({number:req.body.number}, {$push: {'staffs': req.body.user}}).then(result => {
    console.log(result);
    res.send(result);
  })
});

module.exports = router;
