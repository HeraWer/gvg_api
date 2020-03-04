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

router.post("/newUser", (req, res) => {
    const user = new LoginUser({
        username: req.body.username,
        password: req.body.password
    });
    
    user
        .save()
        .then(result => {
            console.log(result);
        })
        .catch(err => {
            console.log(err);
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