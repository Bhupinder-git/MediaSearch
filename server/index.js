// Import dependencies
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const authRoutes = require('./routes/auth');
const collectionRoutes = require('./routes/collection');

// Import environment variables
require('dotenv').config();

// Import database connection
const dbConnect = require('./config/dbConnect');

// Import controllers
const { signup, login, logout, getMe, getCollection, addToCollection, removeFromCollection } = require('./controllers/user');

// Import middleware
const authentication = require('./middlewares/authentication');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 4000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// ===== Middlewares =====

// CORS — allow frontend origin with credentials (cookies)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', CLIENT_URL);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Parse JSON bodies
app.use(express.json());

// Parse cookies
app.use(cookieParser());

// HTTP request logger
app.use(morgan('dev'));

// ===== Routes =====

// Health check
app.get('/api/health', (req, res) => {
    res.status(200).json({ success: true, message: 'Server is running.' });
});

// Auth routes (public)
app.use('/api/auth', authRoutes);

// Collection routes (protected)
app.use('/api/collection', collectionRoutes);

// ===== Start Server =====
async function startServer() {
    // Connect to MongoDB
    await dbConnect();

    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
}

startServer();
