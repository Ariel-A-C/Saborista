const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect("mongodb+srv://admin:admin@clustersaboristav2.nmetz.mongodb.net/?retryWrites=true&w=majority");

const UserSchema = new mongoose.Schema({
    name: String,
    password: String
});

const UserModel = mongoose.model("usuarios", UserSchema);

app.post("/getUsuarios", (req, res) => {
    console.log("hola");
    res.json(UserModel.find({}).then(function (usuarios) {
        console.log("found usuarios");
        res.json(usuarios);
    })).catch(function (err) {
        console.log(err);
    });
});

app.use(express.static("public"));

app.listen(3000, () => {
    console.log("Server is running");
});




