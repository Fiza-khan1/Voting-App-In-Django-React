import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './CssFolder/signup.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function SignUpPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [errorMessages, setErrorMessages] = useState('');

  const handleRegister = async (event) => {
    event.preventDefault();

    // Use FormData to handle form input
    const formData = new FormData(event.target);
    const data = {
      username: formData.get('username'),
      email: formData.get('email'),
      password: formData.get('password'),
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const jsonResponse = await response.json();
        console.log('User registered successfully:', jsonResponse);

        alert('User registered successfully');
        navigate('/login');
      } else {
        const errorResponse = await response.json();
        console.error('Failed to register user:', errorResponse);

        // Extract and format error messages
        let errorMessage = 'Failed to register user:';
        if (errorResponse.username) {
          errorMessage += ` Username: ${errorResponse.username.join(', ')}`;
        }
        if (errorResponse.email) {
          errorMessage += ` Email: ${errorResponse.email.join(', ')}`;
        }
        if (errorResponse.password) {
          errorMessage += ` Password: ${errorResponse.password.join(', ')}`;
        }

        setErrorMessages(errorMessage);
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessages('An error occurred');
    }
  };

  return (
    <Container className="signup-container">
      <h2 className="text-center">Sign Up</h2>
      {errorMessages && (
        <div className="alert alert-danger" role="alert">
          {errorMessages}
        </div>
      )}
      <Form onSubmit={handleRegister} className="signup-form">
        <Form.Group controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            name="username"
            type="text"
            placeholder="Enter username"
            required
          />
        </Form.Group>

        <Form.Group controlId="formEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            name="email"
            type="email"
            placeholder="Enter email"
            required
          />
        </Form.Group>
        <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            name="password"
            type="password"
            placeholder="Enter password"
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3">
          Sign Up
        </Button>
      </Form>
    </Container>
  );
}

export default SignUpPage;
