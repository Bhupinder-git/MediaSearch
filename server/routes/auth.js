// Auth routes
const express = require('express');
const router = express.Router();

// Import controllers
const { signup, login, logout, getMe } = require('../controllers/user');

// Import middleware
const authentication = require('../middlewares/authentication');

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

// Protected routes
router.get('/me', authentication, getMe);

module.exports = router;
