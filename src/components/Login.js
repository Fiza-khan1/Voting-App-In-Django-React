import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './CssFolder/login.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function LoginPage() {
  const [errorMessages, setErrorMessages] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      username: formData.get('username'),
      password: formData.get('password'),
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const jsonResponse = await response.json();
        login(jsonResponse.token); // Store token and update context
        console.log('User logged in successfully:', jsonResponse);
        alert('Login successful');
        navigate('/dashboard'); // Redirect to a dashboard or home page
      } else {
        const errorResponse = await response.json();
        console.error('Failed to login:', errorResponse);

        // Extract and format error messages
        let errorMessage = 'Failed to login:';
        if (errorResponse.username) {
          errorMessage += ` Username: ${errorResponse.username.join(', ')}`;
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
    <Container className="login-container">
      <h2 className="text-center">Login</h2>
      {errorMessages && <div className="alert alert-danger">{errorMessages}</div>}
      <Form onSubmit={handleSubmit} className="login-form">
        <Form.Group controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            placeholder="Enter username"
            required
          />
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            placeholder="Enter password"
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Login
        </Button>
      </Form>
      <div className="text-center mt-3">
        <p>
          Not a user? <Link to="/signup">Register here</Link>
        </p>
      </div>
    </Container>
  );
}

export default LoginPage;
