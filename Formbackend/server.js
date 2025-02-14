const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/user');  // Renaming to avoid conflict
const userRouter = require('./routes/user'); // Import the user router

// Load environment variables from the .env file
dotenv.config();

// Initialize an Express app
const app = express();

// Middleware to parse incoming JSON request bodies
app.use(express.json());
app.use(userRouter); // Use the user router

const test = async (email, password) => {
  const user = await User.findOne({ email: email });
  const result = await user.comparePassword(password);
  console.log(result);
};

 //test('vaishu8@gmail.com', '1234567');

// Database Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log(' MongoDB connected'))
    .catch(err => console.error(' MongoDB connection error:', err));


app.get('/test', (req, res) => {
    res.send('Hello World');
});

app.get('/', (req, res) => {
    res.send({success: true, message: 'Welcome to Form backend'});
});

const PORT = process.env.PORT || 8000; // Default to 8000 if no PORT in .env
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
