const express = require('express');
const DiaryEntry = require('../models/DiaryEntry');
const jwt = require('jsonwebtoken');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

//middleware to authenticate token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token.' });
        req.user = user;
        next();
    });
};

//get all diary entries for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
    try {
        const entries = await DiaryEntry.find({ userId: req.user.userId }).sort({ date: -1 });
        res.json(entries);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching entries.', error });
    }
});

//add a new diary entry
router.post('/', authenticateToken, async (req, res) => {
    const { text } = req.body;
    try {
        const newEntry = new DiaryEntry({ userId: req.user.userId, text });
        await newEntry.save();
        res.status(201).json(newEntry);
    } catch (error) {
        res.status(500).json({ message: 'Error adding entry.', error });
    }
});

//delete a diary entry
router.delete('/:id', authenticateToken, async (req, res) => {
    const entryId = req.params.id;
    try {
        const entry = await DiaryEntry.findById(entryId);
        if (!entry) return res.status(404).json({ message: 'Entry not found.' });
        if (entry.userId.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Unauthorized to delete this entry.' });
        }
        await DiaryEntry.findByIdAndDelete(entryId);
        res.json({ message: 'Entry deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting entry.', error });
    }
});

module.exports = router;