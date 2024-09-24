import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { useParams } from 'react-router-dom';
import './CssFolder/ElectionOption.css';
function ElectionOption() {
  const [agenda, setAgenda] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [voteSuccess, setVoteSuccess] = useState(false);
  const [voteError, setVoteError] = useState(null);
  const [hasVoted, setHasVoted] = useState(null);
  const [voteDetails, setVoteDetails] = useState(null);
  const [votingEnabled, setVotingEnabled] = useState(true); // State to handle button enable/disable
  const { id } = useParams();

  useEffect(() => {
    const fetchAgenda = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No token found');
        setIsAuthenticated(false);
        return;
      }

      try {
        const response = await fetch(`http://127.0.0.1:8000/agendass/${id}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            setIsAuthenticated(false);
            console.error('Unauthorized access. Please log in.');
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
      }
    };

    const checkVoteStatus = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No token found');
        setHasVoted(false);
        return;
      }

      try {
        const response = await fetch(`http://127.0.0.1:8000/check-vote-status/${id}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            setIsAuthenticated(false);
            console.error('Unauthorized access. Please log in.');
            return;
          }
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log("UPCOMMING VOTE DATA : ",data)
        setHasVoted(data.has_voted);
        if (data.has_voted) {
          setVoteDetails({
            optionId: data.voted_option_id,
            optionName: data.voted_option_name,
          });
          setVotingEnabled(false); // Disable all buttons after voting
        } else {
          setVoteDetails(null);
          setVotingEnabled(true); // Enable all buttons if not voted
        }
      } catch (error) {
        console.error('Fetch error:', error);
        setHasVoted(false);
      }
    };

    fetchAgenda();
    checkVoteStatus();
  }, [id]);

  const handleVote = async (optionId) => {
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('authToken');
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
          agenda: id,
          option: optionId,
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
      setHasVoted(true);
      setVoteDetails({
        optionId: optionId,
        optionName: agenda.options.find(option => option.id === optionId).name
      });
      setVotingEnabled(false); // Disable all buttons after voting
    } catch (error) {
      console.error('Vote error:', error);
      setVoteError('An error occurred while submitting your vote.');
      setVoteSuccess(false);
    }
  };

  const handleChangeVote = () => {
    if (window.confirm('Do you want to change your vote?')) {
      // User confirmed to change vote
      setVotingEnabled(true); // Enable all buttons
      setHasVoted(false); // Reset vote status
      setVoteDetails(null); // Clear current vote details
    }
  };

  if (!agenda) {
    return <p>Loading...</p>;
  }

  return (
    <Container className="election-option-container mt-4">
      <h2 className="election-option-title text-center mb-4">Candidates for {agenda.name}</h2>
      {voteError && <p className="election-option-text-danger">{voteError}</p>}
      {voteSuccess && <p className="election-option-text-success">Your vote has been successfully submitted!</p>}
      {hasVoted !== null && (
        <p className="election-option-text-success">
          {hasVoted ? `You have voted for ${voteDetails ? voteDetails.optionName : 'this option'}.` : ''}
        </p>
      )}
      <Row className="g-4">
        {agenda.options.length > 0 ? (
          agenda.options.map((option) => (
            <Col md={6} lg={4} key={option.id}>
              <Card className="election-option-card">
                <Card.Body className="election-option-card-body">
                  <Card.Title>{option.name}</Card.Title>
                  <button
                    className={`election-option-btn ${!votingEnabled || (hasVoted && voteDetails.optionId === option.id) ? 'disabled' : ''}`}
                    onClick={() => handleVote(option.id)}
                    disabled={!votingEnabled || (hasVoted && voteDetails.optionId === option.id)}
                  >
                    {hasVoted && voteDetails.optionId === option.id ? `Current Vote` : `Vote for ${option.name}`}
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
      {hasVoted && (
        <div className="text-center mt-4">
          <button
            className="election-option-change-btn"
            onClick={handleChangeVote}
          >
            Change Your Vote
          </button>
        </div>
      )}
    </Container>
  );
}

export default ElectionOption;
