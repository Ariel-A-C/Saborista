const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { WebSocketServer } = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        wss.clients.forEach((client) => {
            client.send(JSON.stringify(JSON.parse(message)));
        });
    });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin:admin@clustersaboristav2.nmetz.mongodb.net/Saborista?retryWrites=true&w=majority");

const db = mongoose.connection;

db.on('error', (err) => {
    console.error('Failed to connect to MongoDB:', err);
});

db.once('open', () => {
    console.log('Connected to MongoDB');
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

    try {
        const existingUser = await UserModel.findOne({ username });

        if (existingUser) {
            console.log('Username already exists');
            return res.status(400).json({ error: 'Username already exists' });
        }

        const maxIDUser = await UserModel.findOne({}).sort({ ID: -1 });
        const maxID = maxIDUser ? maxIDUser.ID : 0;
        const newUserID = maxID + 1;

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

    try {
        const user = await UserModel.findOne({ username });

        if (!user || user.password !== password) {
            console.log('Invalid username or password');
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        res.cookie('user', JSON.stringify({ username, isAdmin: user.isAdmin }));

        console.log('Login successful');
        res.status(200).json({ message: 'Login successful' });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Define schema and model
const RecetaSchema = new mongoose.Schema({
    customID: { type: Number, default: 1 },
    Username: String,
    Nombre: String,
    Imagen: String,
    Descripcion: String,
    Utensilios: [String],
    Ingredientes: [String],
    Pasos: [String],
    Valoracion: { type: Number, default: 0 }
});
const RecetaModel = mongoose.model("recetas", RecetaSchema);

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
        const randomName = uuidv4();
        const fileName = `${randomName}.jpg`; // Define fileName here
        cb(null, fileName);
        return fileName; // Return fileName
    }
});

const upload = multer({ storage: storage });

app.post("/guardarReceta", upload.single('imagen'), async (req, res) => {
    const fileName = req.file.filename; // Get fileName from req.file

    console.log('Received request to save recipe...'); // Debug message

    const { nombre, descripcion } = req.body;
    const username = getUsernameFromCookie(req);

    try {
        const utensilios = JSON.parse(req.body.utensilios);
        const ingredientes = JSON.parse(req.body.ingredientes);
        const pasos = JSON.parse(req.body.pasos);

        console.log('Parsed request body...'); // Debug message

        const maxCustomIDRecipe = await RecetaModel.findOne({}).sort({ customID: -1 });
        const maxCustomID = maxCustomIDRecipe ? maxCustomIDRecipe.customID : 0;
        const newCustomID = maxCustomID + 1;

        console.log('New Custom ID:', newCustomID); // Debug message

        const newReceta = new RecetaModel({
            customID: newCustomID, // Use the new customID
            Username: username,
            Nombre: nombre,
            Imagen: `uploads/${fileName}`,
            Descripcion: descripcion,
            Utensilios: utensilios,
            Ingredientes: ingredientes,
            Pasos: pasos
        });

        await newReceta.save();

        console.log('Receta guardada exitosamente'); // Success message
        res.status(201).json({ message: 'Receta guardada exitosamente' });
    } catch (err) {
        console.error('Error al guardar la receta:', err); // Error message
        res.status(500).json({ error: 'Error al guardar la receta', errorMessage: err.message });
    }
});


// GET endpoint to fetch recipe by customID
app.get('/getRecipe', async (req, res) => {
    const recipeId = req.query.id;

    try {
        const recipe = await RecetaModel.findOne({ customID: recipeId });

        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        res.json(recipe);
    } catch (err) {
        console.error('Error fetching recipe:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET endpoint to fetch all recipes
app.get("/getRecipes", async (req, res) => {
    try {
        const recipes = await RecetaModel.find({}, { _id: 0, __v: 0 });

        // Update image paths
        recipes.forEach(recipe => {
            recipe.Imagen = `../${recipe.Imagen}`;
        });

        res.status(200).json(recipes);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get("/getUserInfo", async (req, res) => {
    try {
        const userToken = req.headers.authorization.split('=')[1];
        const decodedUserToken = JSON.parse(decodeURIComponent(userToken));
        const username = decodedUserToken.username;

        const user = await UserModel.findOne({ username });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userRecipes = await RecetaModel.find({ Username: username }, { Nombre: 1, customID: 1, _id: 0 }); // Include customID field

        res.status(200).json({
            username: user.username,
            isAdmin: user.isAdmin,
            recipes: userRecipes
        });
    } catch (err) {
        console.error('Error fetching user information:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const CommentsSchema = new mongoose.Schema({

    customID: { type: Number, default: 1 },
    username: String,
    recipeID: Number,
    text: String,
    date: String
});

const CommentsModel = mongoose.model("comentarios", CommentsSchema);

app.post("/saveComment", async (req, res) => {

    const { text, recipeID, date } = req.body;
    const username = getUsernameFromCookie(req);

    try {

        const maxCustomIDComment = await CommentsModel.findOne({}).sort({ customID: -1 });
        const maxCustomID = maxCustomIDComment ? maxCustomIDComment.customID : 0;
        const newCustomID = maxCustomID + 1;

        const newComentario = new CommentsModel({
            customID: newCustomID,
            username: username,
            recipeID: recipeID,
            text: text,
            date: date
        });

        await newComentario.save();

        console.log('Comentario guardado exitosamente');
        res.status(201).json({ message: 'Comentario guardado exitosamente' });
    } catch (err) {
        console.error('Error al guardar el comentario:', err);
        res.status(500).json({ error: 'Error al guardar el comentario', errorMessage: err.message });
    }
});

app.get('/getComments', async (req, res) => {
    try {
        const comments = await CommentsModel.find({}, { _id: 0, __v: 0 });
        res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(3000, () => {
    console.log("Server is running");
});

function getUsernameFromCookie(req) {
    const userToken = req.headers.authorization.split('=')[1];
    const decodedUserToken = JSON.parse(decodeURIComponent(userToken));
    return decodedUserToken.username;
}
