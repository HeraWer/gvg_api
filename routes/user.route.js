const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
require("dotenv").config();

const User = require("../schemas/User");

router.get("/allUsers", async (req, res) => {
    User.find().then(result => {
        res.send(result);
    })
});

router.get("/getUser", async (req, res) => {
    User.findOne({username: req.body.username}).then(result => {
        res.send(result);
    })
});

router.post("/login", async (req, res) => {

    var loginUser = ({
        username: req.body.username,
        password: req.body.password
    })
    var token = jwt.sign(loginUser.username, process.env.SECRETO);
    var message = "Este usuario no existe en la base de datos";

    User.findOne(loginUser).then(result => {

        if(result) {
            res.send(JSON.parse('{"token":"'+token+'"}'));
        }else {
            res.send(JSON.parse('{"message":"'+message+'"}'));
        }
    })

})

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

module.exports = router;