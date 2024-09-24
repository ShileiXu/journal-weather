const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const authRoutes = require('./routes/auth');
const entriesRoutes = require('./routes/entries');



const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // Adjust if your frontend is hosted elsewhere
    credentials: true,
}));
app.use(express.json());

// Routes
app.use('/', authRoutes);
app.use('/entries', entriesRoutes);

// Root Route
app.get('/', (req, res) => {
    res.send('Welcome to the Online Diary API');
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB.');
    // Start Server
    app.listen(PORT, () => console.log(`Server running on port ${PORT}.`));
}).catch(err => {
    console.error('MongoDB connection error:', err);
});