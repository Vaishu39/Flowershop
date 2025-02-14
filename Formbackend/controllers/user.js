const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Controller to handle user registration
exports.createUser = async (req, res) => {
    console.log('Incoming request body:', req.body);

    try {
        const { fullName, email, password, confirmPassword } = req.body;

        // Validate that all required fields are present
        if (!fullName || !email || !password || !confirmPassword) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Create new user instance
        const newUser = new User({ fullName, email, password, confirmPassword });

        // Save the user to the database
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ error: 'This email is already in use, try sign-in' });
    }
};

// Controller to handle user login
exports.userSignIn = async (req, res) => {
    const { email, password } = req.body;

    console.log(email, password);

    try {
        // Check if email already exists
        const existingUser = await User.findOne({ email }); // Find user by email

        if (!existingUser) {
            return res.json({
                success: false,
                message: 'User not found with the given email!',
            });
        }

        // Check if password is correct
        const isMatch = await existingUser.comparePassword(password);
        if (!isMatch) {
            return res.json({
                success: false,
                message: 'Email / password does not match!',
            });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: existingUser._id }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        const userInfo = {
            fullName: existingUser.fullName,
            email: existingUser.email,
        };

        res.json({
            success: true,
            user: userInfo, // Corrected the response structure
            token
        });
    } catch (err) {
        console.error('Error during sign-in:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
