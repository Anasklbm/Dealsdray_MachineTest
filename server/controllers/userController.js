const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables from .env file

const signup = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    // Check if any required field is missing
    if (!firstname || !lastname || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Create a new user
    const newUser = new User({ firstname, lastname, email, password });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error signing up user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if any required field is missing
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found. Please register first.' });
    }

    // Check if the password is correct
    if (password !== user.password) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });

    // Handle successful login
    res.status(200).json({ message: 'Login successful', token, user });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const getUserDetails = async (req, res) => {
  try {
    // Get user details from the request object
    const userId = req.user.userId;
  
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: User not found' });
    }

    // Fetch additional details from the database
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized: User not found in the database' });
    }

    return res.json({ success: true, user });
  } catch (error) {
    console.error('Error fetching user details:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}; 

module.exports = { signup, login, getUserDetails };
