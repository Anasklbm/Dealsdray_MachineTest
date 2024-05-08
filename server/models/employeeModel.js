const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobile: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true
    },
    courses: {
        type: [String],
        default: []
    },
    image: {
        type: String // You can store the path to the image file
    },
    createdAt: {
        type: Date,
        default: Date.now // Default value is the current date and time
    }
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
