const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const multer = require('multer');
const path = require('path');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Route to handle adding an employee
router.post('/addemploy', upload.single('image'), employeeController.addEmployee);

router.get('/getallemploy', employeeController.getAllEmployees);

// Route to delete an employee
router.delete('/deleteEmployee/:id', employeeController.deleteEmployee);

// Route to edit an employee
router.put('/editemployee/:id', upload.single('image'), employeeController.editEmployee);

module.exports = router;
