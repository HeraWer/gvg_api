// IMPORTS
const express = require("express");
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
require("dotenv").config();
const routeUser = require("./routes/user.route");

var multer = require('multer');
var GridFsStorage = require('multer-gridfs-storage');
var Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const path = require('path');
var fs = require('fs');

app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');

// URL para mongo atlas, variables del fichero config.js
const url = "mongodb+srv://" + process.env.atlasUsername + ":" + process.env.atlasPassword + "@projectintercruises-gpdno.mongodb.net/intercruises?retryWrites=true&w=majority";

// Conexion a la base de datos.
var conn = mongoose
    .connect(process.env.MONGODB_URI || url , {
        useNewUrlParser: true, 
        useUnifiedTopology: true
    },
        () => console.log("connected to database!"))
    .catch((err) => {
            console.log("No ha podido conectarse a la base de datos");
        throw err;
    });

    Grid.mongo = mongoose.mongo;

// Puerto de Heroku si no abre con el 8080
const PORT = process.env.PORT || 8080;

// Cuando hacemos comando "node index.js" se nos iniciara el puerto 8080 si no esta el otro y lo tendra abierto escuchando
app.listen(PORT, () => 
  console.log(`El servidor está inicializado en el puerto ${PORT}`));

app.use(cors());
// Aqui le decimos que usa la ruta a partir de raiz y lo que se encuentre en el user.route.js
app.use("/", routeUser);
