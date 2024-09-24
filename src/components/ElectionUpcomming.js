import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { useParams, useNavigate } from 'react-router-dom';

function ElectionOptionUpcomming() {
  const [agenda, setAgenda] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [voteSuccess, setVoteSuccess] = useState(false);
  const [voteError, setVoteError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const { id } = useParams(); // Get agenda ID from URL params
  const navigate = useNavigate(); // For redirecting after voting or deletion
  useEffect(() => {
    const fetchAgenda = async () => {
      try {
        const token = localStorage.getItem('authToken');
        
        // Prepare headers
        const headers = {
          'Content-Type': 'application/json',
        };
  
        // Add token to headers if it exists
        if (token) {
          headers['Authorization'] = `Token ${token}`;
        }
  
        const response = await fetch(`http://127.0.0.1:8000/routers/Newagendas/${id}/`, {
          method: 'GET',
          headers: headers,
        });
  
        if (!response.ok) {
          if (response.status === 401) {
            setIsAuthenticated(false);
            setVoteError('Unauthorized access. Please log in.');
            return;
          }
          throw new Error('Network response was not ok');
        }
  
        const data = await response.json();
        setAgenda(data);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Fetch error:', error);
        setIsAuthenticated(false);
        setVoteError('An error occurred while fetching the agenda.');
      }
    };
  
    fetchAgenda();
  }, [id]);
  const handleVote = async (optionId) => {
    const token = localStorage.getItem('authToken');
    const username = localStorage.getItem('username');

    if (!token || !username) {
      console.error('No token or username found');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/voting/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({
          username: username,
          agenda: id,  // Agenda ID from the URL params
          option: optionId,  // Option ID selected
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setVoteError(errorData.detail || 'Failed to vote');
        setVoteSuccess(false);
        return;
      }

      setVoteSuccess(true);
      setVoteError(null);
    } catch (error) {
      console.error('Vote error:', error);
      setVoteError('An error occurred while submitting your vote.');
      setVoteSuccess(false);
    }
  };

  // Function to handle deletion
  const handleDelete = async () => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/routers/Newagendas/${id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        setDeleteError(errorData.detail || 'Failed to delete agenda');
        setDeleteSuccess(false);
        return;
      }

      setDeleteSuccess(true);
      setDeleteError(null);
      // Optionally redirect or update UI after successful delete
      navigate('/some-route'); // Redirect to a different route if needed
    } catch (error) {
      console.error('Delete error:', error);
      setDeleteError('An error occurred while deleting the agenda.');
      setDeleteSuccess(false);
    }
  };

  if (!agenda) {
    return <p>Loading...</p>;
  }

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Options for {agenda.name}</h2>
      {voteError && <p className="text-danger">{voteError}</p>}
      {voteSuccess && <p className="text-success">Your vote has been successfully submitted!</p>}
      {deleteError && <p className="text-danger">{deleteError}</p>}
      {deleteSuccess && <p className="text-success">The agenda has been successfully deleted!</p>}
      <Row className="g-4">
        {agenda.options.length > 0 ? (
          agenda.options.map((option) => (
            <Col md={6} lg={4} key={option.id}>
              <Card className="custom-card">
                <Card.Body>
                  <Card.Title>{option.name}</Card.Title>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleVote(option.id)}
                    disabled={true} // Disable the button
                  >
                    Vote for {option.name}
                  </button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <Card>
              <Card.Body>
                <Card.Text>No options available.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    
    </Container>
  );
}

export default ElectionOptionUpcomming;
