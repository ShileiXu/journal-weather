const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

//user Signup
router.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: 'Username already taken.' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error during signup.', error });
    }
});

//user Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        console.log('JWT_SECRET:', JWT_SECRET);
        console.log('JWT_SECRET:', process.env.JWT_SECRET); 
        console.log(`Login attempt for username: ${username}`);
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'User not found.' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log(password);
        console.log(user.password);
        if (!isPasswordValid) return res.status(400).json({ message: 'Invalid password.' });

        const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error('Login error:', error); // Log the full error
        res.status(500).json({
            message: 'Server error during login.',
            error: error, // Send the entire error object for debugging
        });
    }
});

module.exports = router;