const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser'); // Import the cookie-parser middleware

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Use the cookie-parser middleware

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

app.post("/loginUser", async (req, res) => {
    const { username, password } = req.body;
    console.log('Received login data:', { username, password });

    try {
        // Find the user in the database
        const user = await UserModel.findOne({ username });

        if (!user || user.password !== password) {
            console.log('Invalid username or password');
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Set the user information in a cookie
        res.cookie('user', JSON.stringify({ username, isAdmin: user.isAdmin }));

        console.log('Login successful');
        res.status(200).json({ message: 'Login successful' });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get("/getUserInfo", async (req, res) => {
    try {
        // Decode the user token from the Authorization header
        const userToken = req.headers.authorization.split('=')[1];

        // Decode the user token (this is a simple decoding, you might want to use a more secure method)
        const decodedUserToken = JSON.parse(decodeURIComponent(userToken));

        // Find the user in the database based on the decoded token
        const user = await UserModel.findOne({ username: decodedUserToken.username });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Return the user information
        res.status(200).json({
            username: user.username,
            password: user.password,
            isAdmin: user.isAdmin,
        });
    } catch (err) {
        console.error('Error fetching user information:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.use(express.static("public"));

app.listen(3000, () => {
    console.log("Server is running");
});