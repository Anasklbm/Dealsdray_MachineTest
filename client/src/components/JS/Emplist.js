import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Navbar, Nav, Table, Modal, Alert } from 'react-bootstrap';

function Emplist() {
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [serverMessage, setServerMessage] = useState('');
  const [serverError, setServerError] = useState(false);
  const [deleteAlert, setDeleteAlert] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('http://localhost:3002/api/getallemploy');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error('There was an error with the fetch operation:', error);
      }
    };

    fetchEmployees();
  }, []);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3002/api/deleteEmployee/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // Remove the deleted employee from the state
      setEmployees(employees.filter(employee => employee._id !== id));
      // Set delete alert
      setDeleteAlert(true);
    } catch (error) {
      console.error('There was an error with the delete operation:', error);
    }
  };

  const handleModalSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:3002/api/editemployee/${selectedEmployee._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedEmployee),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      // Update the employee in the state with the edited data
      setEmployees(employees.map(emp => emp._id === selectedEmployee._id ? selectedEmployee : emp));
  
      // Close the modal after successfully updating the employee
      setShowModal(false);

      // Set server message and error states based on response
      const data = await response.json();
      setServerMessage(data.message);
      setServerError(false);
    } catch (error) {
      console.error('There was an error with the edit operation:', error);
      // Set server message and error states based on error
      setServerMessage('Error updating employee');
      setServerError(true);
    }
  };
  

  const handleChange = (e) => {
    const { id, value, type, checked, files } = e.target;
    let updatedEmployee = { ...selectedEmployee };

    if (type === 'checkbox') {
      if (checked) {
        updatedEmployee.courses.push(id);
      } else {
        updatedEmployee.courses = updatedEmployee.courses.filter(course => course !== id);
      }
    } else if (type === 'file') {
      setSelectedImage(files[0]);
    } else {
      updatedEmployee = {
        ...updatedEmployee,
        [id]: value
      };
    }

    setSelectedEmployee(updatedEmployee);
  };

  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg" className="justify-content-center">
        <Navbar.Brand href="#home">Logo</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/dashboard">Home</Nav.Link>
            <Nav.Link href="/emp">Add Employee</Nav.Link>
            <Nav.Link href="/list">Employee List</Nav.Link>
          </Nav>
          <Nav className="ml-auto">
            <Nav.Link href="/">Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Container className="mt-4">
        <Row>
          <Col>
            <h3>Employee List</h3>
            {/* Render alert for server messages */}
            {serverMessage && (serverError ? 
              <Alert variant="danger">{serverMessage}</Alert> : 
              <Alert variant="success">{serverMessage}</Alert>)
            }
            {/* Render delete alert */}
            {deleteAlert && 
              <Alert variant="success" onClose={() => setDeleteAlert(false)} dismissible>
                Employee deleted successfully!
              </Alert>
            }
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Designation</th>
                  <th>Gender</th>
                  <th>Created At</th>
                  <th>Courses</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(employee => (
                  <tr key={employee._id}>
                    <td>{employee.name}</td>
                    <td>{employee.email}</td>
                    <td>{employee.mobile}</td>
                    <td>{employee.designation}</td>
                    <td>{employee.gender}</td>
                    <td>{new Date(employee.createdAt).toLocaleDateString()}</td>
                    <td>{employee.courses.join(', ')}</td>
                    <td>
                      <Button variant="primary" size="sm" className="mr-2" onClick={() => handleEdit(employee)}>Edit</Button>
                      <Button variant="danger" className="ms-4" size="sm" onClick={() => handleDelete(employee._id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Enter name" value={selectedEmployee ? selectedEmployee.name : ''} onChange={handleChange} required />
            </Form.Group>

            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Enter email" value={selectedEmployee ? selectedEmployee.email : ''} onChange={handleChange} required />
            </Form.Group>

            <Form.Group controlId="mobile">
              <Form.Label>Mobile Number</Form.Label>
              <Form.Control type="text" placeholder="Enter mobile number" value={selectedEmployee ? selectedEmployee.mobile : ''} onChange={handleChange} required />
            </Form.Group>

            <Form.Group controlId="designation">
              <Form.Label>Designation</Form.Label>
              <Form.Control as="select" value={selectedEmployee ? selectedEmployee.designation : ''} onChange={handleChange} required>
                <option value="">Select designation</option>
                <option>HR</option>
                <option>Manager</option>
                <option>Sales</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="gender">
              <Form.Label>Gender</Form.Label><br />
              <Form.Check inline type="radio" label="Male" name="gender" value="male" checked={selectedEmployee && selectedEmployee.gender === 'male'} onChange={handleChange} required />
              <Form.Check inline type="radio" label="Female" name="gender" value="female" checked={selectedEmployee && selectedEmployee.gender === 'female'} onChange={handleChange} required />
            </Form.Group>

            <Form.Group controlId="courses">
              <Form.Label>Courses</Form.Label><br />
              <Form.Check inline label="MCA" type="checkbox" id="MCA" checked={selectedEmployee && selectedEmployee.courses.includes('MCA')} onChange={handleChange} />
              <Form.Check inline label="BCA" type="checkbox" id="BCA" checked={selectedEmployee && selectedEmployee.courses.includes('BCA')} onChange={handleChange} />
              <Form.Check inline label="BSC" type="checkbox" id="BSC" checked={selectedEmployee && selectedEmployee.courses.includes('BSC')} onChange={handleChange} />
            </Form.Group>

            <Form.Group controlId="image">
              <Form.Label>Image Upload</Form.Label>
              <Form.Control type="file" onChange={handleChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
          <Button variant="primary" onClick={handleModalSubmit}>Save changes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Emplist;
