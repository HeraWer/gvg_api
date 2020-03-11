const express = require("express");
const router = express.Router();

const LoginUser = require("../schemas/LoginUser");

router.get("/allUsers", async (req, res) => {
    LoginUser.find().then(result => {
        res.send(result);
    })
});

router.get("/getUser", async (req, res) => {
    LoginUser.findOne({username: req.body.username}).then(result => {
        res.send(result);
    })
});

router.get("/login", async (req, res) => {
    var loginUser = ({
        username: req.body.username,
        password: req.body.password
    })

    console.log(loginUser);

    LoginUser.findOne(loginUser).then(result => {
        if(result) {
            res.send(true);
        }else {
            res.send(false);
        }
    })

})

router.post("/newUser", (req, res) => {
    const user = new LoginUser({
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
    LoginUser.deleteOne({username: req.body.username}).then(result => {
        res.send("Usuario eliminado correctamente");
    })
});

router.post("/updateUser", async(req, res) => {
    LoginUser.findOneAndUpdate({username: req.body.username}, {password: req.body.password}).then(result => {
        res.send("Usuario modificado correctamente")
    })
});

module.exports = router;