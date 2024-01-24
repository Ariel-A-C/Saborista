const express = require('express');
const { WebSocketServer } = require('ws');
const http = require('http');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/appdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use(bodyParser.json());

// Define a user schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});

const User = mongoose.model('User', userSchema);

wss.on('connection', (ws) => {
    ws.on('message', async (message) => {
        try {
            const data = JSON.parse(message);

            // Check the message type (e.g., registration)
            if (data.type === 'register') {
                // Create a new user in the database
                const newUser = new User({
                    username: data.username,
                    password: data.password,
                });

                await newUser.save();

                // Broadcast the updated user list to all clients
                wss.clients.forEach((client) => {
                    client.send(JSON.stringify({ type: 'userListUpdate' }));
                });
            }
        } catch (error) {
            console.error('Error processing message:', error);
        }
    });
});

app.use(express.static('public'));

// Define your HTTP routes here
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Create a new user in the database
        const newUser = new User({
            username,
            password,
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Client-side JavaScript
app.get('/registro.html', (req, res) => {
    res.sendFile(__dirname + '/registro.html');
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
