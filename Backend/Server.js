const express = require('express'); // Express is used to create the server and handle HTTP requests
const mongoose = require('mongoose'); // Mongoose is used to interact with MongoDB database
const dotenv = require('dotenv'); // dotenv loads environment variables from a .env file
const cors = require('cors'); // CORS middleware to handle Cross-Origin Resource Sharing
const flowerRoutes = require('./routes/flowerRoute'); // Import routes for flower-related operations
const path = require('path'); // Path module is used to handle and transform file paths

// Load environment variables from the .env file
dotenv.config();

// Initialize an Express app
const app = express();

// Middleware to enable Cross-Origin Resource Sharing (CORS)
app.use(cors({
    origin: '*', // Allows all origins. In production, this should be restricted to trusted domains
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Specifies allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Specifies which headers are allowed in the request
}));

// Middleware to parse incoming requests with JSON payloads
app.use(express.json()); 

// Serve static files from the 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); //To serve images and other static files.



// Middleware to handle flower-related routes (CRUD operations)
app.use('/api/flowers', flowerRoutes); //Requests to flowerRoutes.

//  Database Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }) // Options used to handle deprecations in MongoDB driver
    .then(() => console.log(' MongoDB connected')) // Success message when connected
    .catch(err => console.error(' MongoDB connection error:', err)); // Error handling if connection fails

// Start the server and listen on the specified port
const PORT = process.env.PORT; // Port is taken from environment variables
app.listen(PORT, () => {
    console.log(` Server is running on port ${PORT}`); // Log message indicating the server is running
});
