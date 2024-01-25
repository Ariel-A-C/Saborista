// saborista.js

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
    ID: Number,
    username: String,
    password: String,
    isAdmin: { type: Boolean, default: false }
});

const UserModel = mongoose.model("usuarios", UserSchema);

app.post("/registerUser", async (req, res) => {
    const { username, password } = req.body;
    console.log('Received data on the server:', { username, password });

    try {
        // Check if the username already exists
        const existingUser = await UserModel.findOne({ username });

        if (existingUser) {
            console.log('Username already exists');
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Find the max ID and increment by 1
        const maxIDUser = await UserModel.findOne({}).sort({ ID: -1 });
        const maxID = maxIDUser ? maxIDUser.ID : 0;
        const newUserID = maxID + 1;

        // Create a new user
        const newUser = new UserModel({ ID: newUserID, username, password });
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
