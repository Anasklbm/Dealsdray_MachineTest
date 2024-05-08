import React, { useState } from 'react';
import { Button, Container, Card, Form, Row, Col, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../CSS/signup.css';

function Signup() {
  const initialFormData = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [showAlert, setShowAlert] = useState(false); // State for controlling alert visibility
  const [serverMessage, setServerMessage] = useState(''); // State for holding server response message

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if any field is empty
    for (const key in formData) {
        if (!formData[key].trim()) {
            setShowAlert(true); // Show alert if any field is empty
            return; // Stop submission if any field is empty
        }
    }

    // If all fields are filled, proceed with form submission
    try {
        const response = await fetch('http://localhost:3002/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            throw new Error('Email already registered');
        }

        const data = await response.json();
        setServerMessage(data.message); // Set server response message
        setShowAlert(true); // Show alert with server message
        console.log(data); // Handle success response

        // Clear all fields after successful submission
        setFormData(initialFormData);
    } catch (error) {
        console.error('There was an error with the fetch operation:', error);
        setServerMessage('Error signing up: ' + error.message); // Set error message
        setShowAlert(true); // Show alert with error message
    }
};


  return (
    <div>
      <Container fluid className='my-5'>
        <Row className='g-0 align-items-center'>
          <Col col='6'>
            <Card className='my-5 cascading-right' style={{ background: 'hsla(0, 0%, 100%, 0.55)', backdropFilter: 'blur(30px)' }}>
              <Card.Body className='p-5 shadow-5 text-center'>
                <h2 className="fw-bold mb-5">Sign up now</h2>
                <Row>
                  <Col col='6'>
                    <Form.Group className='mb-4'>
                      <Form.Label>First name</Form.Label>
                      <Form.Control id='firstname' type='text' value={formData.firstname} onChange={handleChange} required />
                    </Form.Group>
                  </Col>
                  <Col col='6'>
                    <Form.Group className='mb-4'>
                      <Form.Label>Last name</Form.Label>
                      <Form.Control id='lastname' type='text' value={formData.lastname} onChange={handleChange} required />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className='mb-4'>
                  <Form.Label>Email</Form.Label>
                  <Form.Control id='email' type='email' value={formData.email} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className='mb-4'>
                  <Form.Label>Password</Form.Label>
                  <Form.Control id='password' type='password' value={formData.password} onChange={handleChange} required />
                </Form.Group>
                <Button className='w-100 mb-4' size='md' onClick={handleSubmit}>Sign up</Button>
                <div className="text-center">
                  <p><Link to="/">Already Registered</Link></p>
                </div>
                {/* Alert for empty fields or server response */}
                <Alert variant='success' show={showAlert} onClose={() => setShowAlert(false)} dismissible>
                  {serverMessage || 'Please fill in all fields.'}
                </Alert>
              </Card.Body>
            </Card>
          </Col>
          <Col col='6'>
            <img src="https://mdbootstrap.com/img/new/ecommerce/vertical/004.jpg" className="w-100 rounded-4 shadow-4" alt="" fluid />
          </Col>
        </Row>
      </Container>

    </div>
  );
}

export default Signup;
