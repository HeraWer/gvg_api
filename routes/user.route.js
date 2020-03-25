const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
require("dotenv").config();

const User = require("../schemas/User");
const Event = require("../schemas/Event");
const Role = require("../schemas/Role");
const Location = require("../schemas/Location");
const Message = require("../schemas/Message");

router.post("/setPhoto", async(req, res) => {
    //var photo = BSON.req.body.photo;
    User.findOneAndUpdate({username: req.body.username}, {photo: req.body.photo}).then(result => {
        res.send("Foto subida correctamente")
    })
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

})

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
