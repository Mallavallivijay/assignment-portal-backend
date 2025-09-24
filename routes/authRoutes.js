const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

router.post('/login', login); //login route
// router.post('/logout', logout); //logout route

module.exports = router;
