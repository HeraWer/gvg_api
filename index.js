/*
 *  Author: Jonatan Valle Corrales
 *  Fecha: 2/3/20
 *  Email: vallejestudiante@gmail.com
*/
// A si es como se importan las cosas en node.js
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const config = require("./config/config");
const routeUser = require("./routes/user.route");

app.use(express.urlencoded({ extended: true}));
app.use(express.json());

// URL para mongo atlas, variables del fichero config.js
const url = "mongodb+srv://" + config.atlasUsername + ":" + config.atlasPassword + "@projectintercruises-gpdno.mongodb.net/intercruises?retryWrites=true&w=majority";

// Conexion a la base de datos.
mongoose
    .connect(url,{useNewUrlParser: true, useUnifiedTopology: true},
        () => console.log("connected to database!"))
    .catch((err) => {
        throw err;
    });

// Puerto de Heroku si no abre con el 3000
const PORT = process.env.PORT || 3000;

// Cuando hacemos comando "node index.js" se nos iniciara el puerto 3000 si no esta el otro y lo tendra abierto escuchando
app.listen(PORT, () => 
    console.log(`El servidor está inicializado en el puerto ${3000}`));

// Aqui le decimos que usa la ruta a partir de raiz y lo que se encuentre en el user.route.js
app.use("/", routeUser);