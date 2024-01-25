const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Add these lines to parse JSON data in the request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://admin:admin@clustersaboristav2.nmetz.mongodb.net/Saborista?retryWrites=true&w=majority");

const db = mongoose.connection;

db.on('error', (err) => {
    console.error('Failed to connect to MongoDB:', err);
});

db.once('open', () => {
    console.log('Connected to MongoDB');
    // Start your server here or perform any other setup
});

const UserSchema = new mongoose.Schema({
    name: String,
    password: String
});

const UserModel = mongoose.model("usuarios", UserSchema);

app.post("/getUsuarios", async (req, res) => {
    try {
        console.log("holaaa");
        const usuarios = await UserModel.find({});
        console.log("found usuarios");
        res.json(usuarios);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post("/registerUser", async (req, res) => {
    const { name, password } = req.body;
    console.log('Received data on the server:', { name, password });

    try {
        // Check if the username already exists
        const existingUser = await UserModel.findOne({ name });

        if (existingUser) {
            console.log('Username already exists');
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Create a new user
        const newUser = new UserModel({ name, password });
        await newUser.save();

        console.log('User registered successfully');
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



app.use(express.static("public"));

app.listen(3000, () => {
    console.log("Server is running");
});