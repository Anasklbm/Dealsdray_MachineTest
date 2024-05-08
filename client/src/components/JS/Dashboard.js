import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Nav, Navbar } from 'react-bootstrap';

const Dashboard = () => {
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        // Retrieve token from local storage
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3002/api/getuserdetails', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Include token in Authorization header
            'Content-Type': 'application/json'
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUserDetails(data.user); // Save only the user object, not the whole data
      } catch (error) {
        console.error('There was an error with the fetch operation:', error);
      }
    };

    fetchUserDetails();
  }, []);

  return (
    <Container fluid>
      <Row>
        <Col xs={12}>
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
                {userDetails && (
                  <Nav.Link href="#user-profile">{`${userDetails.firstname} ${userDetails.lastname}`}</Nav.Link>
                )}
                <Nav.Link href="/">Logout</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col xs={12}>
          <h3 className="text-center">Dashboard</h3>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col xs={12}>
          <h5 className="text-center">Welcome Admin Panel</h5>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
