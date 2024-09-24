import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import './CssFolder/Dashboard.css'; // Your custom CSS

function Home() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem('authToken');
  
      try {
        const response = await fetch('http://127.0.0.1:8000/profile/', {
          headers: {
            'Authorization': `Token ${token}`,
          },
        });
  
        if (response.ok) {
          const profileData = await response.json();
          setUser(profileData);
          setFormData(profileData);
          localStorage.setItem('username', profileData.username);
          localStorage.setItem('is_superuser', profileData.is_superuser);
          setUsername(profileData.username);
        } else {
          console.error('Failed to fetch profile:', await response.json());
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    fetchProfileData();
  }, []);
  
  return (
    <Container className="mt-4 custom-container">
      <h1 className="text-center mb-4 custom-heading">Welcome to the Voting System</h1>

      {localStorage.getItem('is_superuser') === 'true' && ( 
        <Card className="mb-4 admin-card">
          <Card.Body>
            <Card.Title className="text-center">Admin Access</Card.Title>
            <Card.Text className="text-center">
              Create and manage voting agendas for the platform.
            </Card.Text>
            <div className="text-center">
  <a href="/agendas" className="btn custom-btn" style={{ color: 'white' }}>
    Create Agenda
  </a>
</div>
          </Card.Body>
        </Card>
      )}

<Row className="mb-4">
  <Col md={6}>
    <Card className="election-card">
      <Card.Body>
        <Card.Title>Current Elections</Card.Title>
        <Card.Text>
          Explore the current voting sessions and make your voice heard. 
          Your vote is your power—don’t miss the opportunity to contribute to the democratic process.
        </Card.Text>
        <a href="/current-elections" className="btn custom-btn">View Current Elections</a>
      </Card.Body>
    </Card>
  </Col>
  
  <Col md={6}>
    <Card className="election-card">
      <Card.Body>
        <Card.Title>Upcoming Elections</Card.Title>
        <Card.Text>
          Stay informed about the upcoming voting sessions and make your voice heard. 
          Your participation is vital for shaping the future. Your participation is vital Your participation is vital 
        </Card.Text>
        <a href="/upcoming" className="btn custom-btn">View Upcoming Elections</a>
      </Card.Body>
    </Card>
  </Col>
</Row>


      <Row>
        <Col>
          <Card className="result-card">
            <Card.Body>
              <Card.Title>Results & Analytics</Card.Title>
              <Card.Text>
                Check out the results from previous votes and analyze the data.
              </Card.Text>
              <a href="/results" className="btn custom-btn">View Results</a>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
