import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';

function VoteCountDisplayOne() {
  const [optionVoteCounts, setOptionVoteCounts] = useState([]);
  const [agendaVoteCounts, setAgendaVoteCounts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVoteCounts = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('User not authenticated. Please log in.');
        return;
      }

      try {
        // Fetch option vote counts
        const optionResponse = await fetch('http://127.0.0.1:8000/option-vote-count/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
        });

        if (!optionResponse.ok) {
          if (optionResponse.status === 401) {
            setError('Unauthorized access. Please log in.');
          } else {
            throw new Error('Failed to fetch option vote counts');
          }
          return;
        }

        const optionData = await optionResponse.json();
        setOptionVoteCounts(optionData);

        // Fetch agenda vote counts
        const agendaResponse = await fetch('http://127.0.0.1:8000/agenda-vote-count/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
        });

        if (!agendaResponse.ok) {
          if (agendaResponse.status === 401) {
            setError('Unauthorized access. Please log in.');
          } else {
            throw new Error('Failed to fetch agenda vote counts');
          }
          return;
        }

        const agendaData = await agendaResponse.json();
        setAgendaVoteCounts(agendaData);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchVoteCounts();

    // Connect to WebSocket
    const socket = new WebSocket('ws://127.0.0.1:9000/ws/vote-count/');
    socket.onopen = () => {
      console.log("WebSocket connection opened");
    };
    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      
      console.log("WebSocket Data Received:", data); 
      setOptionVoteCounts(data.option_counts || []);
      setAgendaVoteCounts(data.agenda_counts || []);
    };
    socket.onerror = (e) => {
      console.error('WebSocket error:', e);
      setError('WebSocket error: ' + e.message);
    };
    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => socket.close();
  }, []);

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Vote Counts</h2>

      <h3 className="mb-3">Option Vote Counts</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Option Name</th>
            <th>Vote Count</th>
            <th>Agenda Title</th>
            <th>Agenda Description</th>
          </tr>
        </thead>
        <tbody>
          {optionVoteCounts.length > 0 ? (
            optionVoteCounts.map((option) => (
              <tr key={option.id}>
                <td>{option.option_name || 'Option Name Missing'}</td>
                <td>{option.vote_count}</td>
                <td>{option.agenda_title || 'Agenda Title Missing'}</td>
                <td>{option.agenda_description || 'Agenda Description Missing'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No option vote counts available.</td>
            </tr>
          )}
        </tbody>
      </Table>

      <h3 className="mb-3 mt-4">Agenda Vote Counts</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Agenda Name</th>
            <th>Total Votes</th>
            <th>Agenda Title</th>
            <th>Agenda Description</th>
          </tr>
        </thead>
        <tbody>
          {agendaVoteCounts.length > 0 ? (
            agendaVoteCounts.map((agenda) => (
              <tr key={agenda.id}>
                <td>{agenda.agenda_name || 'Agenda Name Missing'}</td>
                <td>{agenda.vote_count}</td>
                <td>{agenda.agenda_title || 'Agenda Title Missing'}</td>
                <td>{agenda.agenda_description || 'Agenda Description Missing'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No agenda vote counts available.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
}

export default VoteCountDisplayOne;
