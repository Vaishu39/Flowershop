const express = require('express');


const router = express.Router();
const { createUser, userSignIn } = require('../controllers/user');
const { validateUserSignUp, userVlidation, validateUserSignIn } = require('../middleware/validation/user');
const { isAuth } = require('../middleware/validation/auth');


// Create a new user
router.post('/create-user', validateUserSignUp, userVlidation, createUser); 

// Sign in a user
router.post('/sign-in', validateUserSignIn, userVlidation, userSignIn);

// Protected route (only accessible if authenticated)
router.post('/create-post',isAuth, (req,res)=>{
    res.send('Welcome you are in secret route')
});// Create a post
module.exports = router;
