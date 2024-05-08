const Employee = require('../models/employeeModel');

const addEmployee = async (req, res) => {
  try {
    const { name, email, mobile, designation, gender, courses } = req.body;

    // Check if any required field is missing
    if (!name || !email || !mobile || !designation || !gender || !courses) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate mobile number format
    const mobilePattern = /^\d{10}$/; // Assuming the mobile number should be exactly 10 digits
    if (!mobilePattern.test(mobile)) {
      return res.status(400).json({ message: 'Invalid mobile number format' });
    }

    // Check if the email or mobile number is already registered
    const existingEmployee = await Employee.findOne({ $or: [{ email }, { mobile }] });
    if (existingEmployee) {
      return res.status(400).json({ message: 'Email or mobile number is already registered' });
    }

    // Create a new employee instance
    const newEmployee = new Employee({
      name,
      email,
      mobile,
      designation,
      gender,
      courses,
      image: req.file ? req.file.path : null // Store the path of the uploaded image
    });

    // Save the new employee to the database
    await newEmployee.save();

    res.status(201).json({ message: 'Employee created successfully', employee: newEmployee });
  } catch (error) {
    console.error('Error adding employee:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



const getAllEmployees = async (req, res) => {
    try {
      const employees = await Employee.find();
      res.status(200).json(employees);
    } catch (error) {
      console.error('Error fetching all employees:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  // Controller to delete an employee
const deleteEmployee = async (req, res) => {
    try {
      const { id } = req.params;

      console.log(id)

      // Find the employee by ID and delete it
      const deletedEmployee = await Employee.findByIdAndDelete(id);
      if (!deletedEmployee) {
        return res.status(404).json({ error: 'Employee not found' });
      }
      res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
      console.error('Error deleting employee:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  const editEmployee = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find the employee by ID
      const employee = await Employee.findById(id);
      if (!employee) {
        return res.status(404).json({ error: 'Employee not found' });
      }
  
      // Update employee data
      employee.name = req.body.name;
      employee.email = req.body.email;
      employee.mobile = req.body.mobile;
      employee.designation = req.body.designation;
      employee.gender = req.body.gender;
      employee.courses = req.body.courses;
      employee.image = req.file ? req.file.path : employee.image;
  
      // Save the updated employee
      await employee.save();
  
      res.status(200).json({ message: 'Employee updated successfully', employee });
    } catch (error) {
      console.error('Error updating employee:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

module.exports = { addEmployee, getAllEmployees, deleteEmployee, editEmployee };
