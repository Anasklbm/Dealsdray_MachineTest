const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const jwtMiddleware = require('../middleware/jwtMiddleware');


router.post('/signup', userController.signup);
router.post('/login', userController.login);

// Route to get user details
router.get('/getuserdetails', jwtMiddleware, userController.getUserDetails);

module.exports = router;