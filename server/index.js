// index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

const userRoutes = require('./routes/userRoutes');
const employeeRoutes = require('./routes/employeeRoutes');


const app = express();

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB 
connectDB();


app.use(cors());
app.use(bodyParser.json()); // Add this line to parse JSON data

// Routes 
app.use('/api', userRoutes);
app.use('/api', employeeRoutes); 

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});     