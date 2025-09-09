const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/AuthController');


router.get('/auth/google', AuthController.initiateGoogleAuth);
router.get('/auth/google/callback', AuthController.handleGoogleCallback);

module.exports = router;