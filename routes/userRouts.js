const express = require('express');
const userController = require('../controllers/ userController');
const router = express.Router();

// Example route
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/getUserProfile', userController.userProfile);

module.exports = router;
