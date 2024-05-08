import React, { useState } from 'react';
import { Button, Container, Card, Form, Row, Col, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import '../CSS/login.css';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertVariant, setAlertVariant] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3002/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Username and password are not matching');
      }
      const data = await response.json();
      console.log(data)
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (error) {
      console.error('There was an error with the fetch operation:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setAlertVariant('danger');
        setAlertMessage(error);
      } else {
        setAlertVariant('danger');
        setAlertMessage(error.message);
      }
      setShowAlert(true);
    }
  };

  return (
    <Container className='my-5'>
      <Card>
        <Row className='g-0 d-flex align-items-center'>
          <Col md='4'>
            <Card.Img src='https://mdbootstrap.com/img/new/ecommerce/vertical/004.jpg' alt='phone' className='rounded-t-5 rounded-tr-lg-0' fluid />
          </Col>
          <Col md='8'>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className='mb-4'>
                  <Form.Label>Email address</Form.Label>
                  <Form.Control id='email' type='email' onChange={handleChange} />
                </Form.Group>
                <Form.Group className='mb-4'>
                  <Form.Label>Password</Form.Label>
                  <Form.Control id='password' type='password' onChange={handleChange} />
                </Form.Group>
                <div className="d-flex justify-content-between mx-4 mb-4">
                  <Form.Check type='checkbox' label='Remember me' />
                  <Link to="/forgot-password">Forgot password?</Link>
                </div>
                <Button type="submit" className="mb-4 w-100">Sign in</Button>
              </Form>
            </Card.Body>
            <div className="text-center">
              <p><Link to="/signup">Don't have an account?</Link></p>
            </div>
          </Col>
        </Row>
      </Card>
      {/* Alert for displaying success or error message */}
      <Alert variant={alertVariant} show={showAlert} onClose={() => setShowAlert(false)} dismissible>
        {alertMessage}
      </Alert>
    </Container>
  );
}

export default Login;
