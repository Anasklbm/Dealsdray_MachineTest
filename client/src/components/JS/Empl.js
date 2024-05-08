import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Navbar, Nav, Alert } from 'react-bootstrap';

function Empl() {
    const initialFormData = {
        name: '',
        email: '',
        mobile: '',
        designation: '',
        gender: '',
        courses: [],
        image: null
    };

    const [formData, setFormData] = useState(initialFormData);
    const [serverMessage, setServerMessage] = useState('');
    const [serverError, setServerError] = useState(false);

    const handleChange = (e) => {
        const { id, value, type, checked, files } = e.target;
        if (type === 'checkbox') {
            const updatedCourses = checked
                ? [...formData.courses, id]
                : formData.courses.filter(course => course !== id);
            setFormData({ ...formData, courses: updatedCourses });
        } else if (type === 'file') {
            setFormData({ ...formData, [id]: files[0] });
        } else {
            setFormData({ ...formData, [id]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (key === 'courses') {
                    value.forEach(course => {
                        formDataToSend.append(key, course);
                    });
                } else {
                    formDataToSend.append(key, value);
                }
            });
    
            const response = await fetch('http://localhost:3002/api/addemploy', {
                method: 'POST',
                body: formDataToSend
            });
    
            const data = await response.json();
            // Set the server message and error state based on the response
            setServerMessage(data.message);
            setServerError(false);
    
            if (response.ok) {
                // Clear all fields after successful submission
                setFormData(initialFormData);
            }
        } catch (error) {
            console.error('There was an error with the fetch operation:', error);
            // Set the server message and error state based on the error
            setServerMessage('Internal server error');
            setServerError(true);
        }
    };
    

    return (
        <>
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

            <Container>
                <Row>
                    <Col>
                        <h3>Create Employee</h3>
                        {/* Display the server message as an alert */}
                        {serverMessage && (serverError ? 
                            <Alert variant="danger">{serverMessage}</Alert> : 
                            <Alert variant="success">{serverMessage}</Alert>)
                        }
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="name">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" placeholder="Enter name" value={formData.name} onChange={handleChange} required />
                            </Form.Group>

                            <Form.Group controlId="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" value={formData.email} onChange={handleChange} required />
                            </Form.Group>

                            <Form.Group controlId="mobile">
                                <Form.Label>Mobile Number</Form.Label>
                                <Form.Control type="text" placeholder="Enter mobile number" value={formData.mobile} onChange={handleChange} required />
                            </Form.Group>

                            <Form.Group controlId="designation">
                                <Form.Label>Designation</Form.Label>
                                <Form.Control as="select" value={formData.designation} onChange={handleChange} required>
                                    <option value="">Select designation</option>
                                    <option>HR</option>
                                    <option>Manager</option>
                                    <option>Sales</option>
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="gender">
                                <Form.Label>Gender</Form.Label><br />
                                <Form.Check inline type="radio" label="Male" name="gender" value="male" checked={formData.gender === 'male'} onChange={handleChange} required />
                                <Form.Check inline type="radio" label="Female" name="gender" value="female" checked={formData.gender === 'female'} onChange={handleChange} required />
                            </Form.Group>

                            <Form.Group controlId="courses">
                                <Form.Label>Courses</Form.Label><br />
                                <Form.Check inline label="MCA" type="checkbox" id="MCA" checked={formData.courses.includes('MCA')} onChange={handleChange} />
                                <Form.Check inline label="BCA" type="checkbox" id="BCA" checked={formData.courses.includes('BCA')} onChange={handleChange} />
                                <Form.Check inline label="BSC" type="checkbox" id="BSC" checked={formData.courses.includes('BSC')} onChange={handleChange} />
                            </Form.Group>

                            <Form.Group controlId="image">
                                <Form.Label>Image Upload</Form.Label>
                                <Form.Control type="file" accept="image/*" onChange={handleChange} required />
                            </Form.Group>

                            <Button variant="primary" type="submit">Submit</Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Empl;
