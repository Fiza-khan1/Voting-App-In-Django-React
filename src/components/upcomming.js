import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import AgendaForm from './test';
import axios from 'axios';

function ElectionOptionUpcomming() {
  const [agendas, setAgendas] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [voteError, setVoteError] = useState(null);
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [selectedAgenda, setSelectedAgenda] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAgendas = async () => {
      const token = localStorage.getItem('authToken');

      // Headers to be conditionally set based on token
      const headers = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Token ${token}`;
      }

      try {
        const response = await fetch('http://127.0.0.1:8000/routers/Newagendas/', {
          method: 'GET',
          headers: headers,  // Use headers whether token exists or not
        });

        if (!response.ok) {
          if (response.status === 401) {
            setIsAuthenticated(false);
            return;
          }
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const today = new Date().toISOString().split('T')[0];
        const upcomingAgendas = data.filter(agenda => agenda.start_date > today);
        setAgendas(upcomingAgendas);

        if (token) {
          setIsAuthenticated(true);
          const superuser = localStorage.getItem('is_superuser');
          setIsSuperuser(superuser === 'true');
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    fetchAgendas();
  }, []);

  const handleViewDetails = (agendaId) => {
    navigate(`/voting/${agendaId}`);
  };

  const handleEditClick = (agenda) => {
    setSelectedAgenda(agenda);
    setShowForm(true);
  };

  const handleDelete = async (agendaId) => {
    const token = localStorage.getItem('authToken');
    try {
      await axios.delete(`http://127.0.0.1:8000/routers/Newagendas/${agendaId}/`, {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });

      setAgendas(agendas.filter(agenda => agenda.id !== agendaId));
      setDeleteError(null); // Clear error message on success
    } catch (error) {
      setDeleteError('Error deleting agenda. Please try again later.');
    }
  };

  const handleSave = (agenda) => {
    setShowForm(false);
    setSelectedAgenda(null);
    const fetchAgendas = async () => {
      const token = localStorage.getItem('authToken');
      const headers = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Token ${token}`;
      }
      try {
        const response = await fetch('http://127.0.0.1:8000/routers/Newagendas/', {
          method: 'GET',
          headers: headers,
        });
        const data = await response.json();
        const today = new Date().toISOString().split('T')[0];
        const upcomingAgendas = data.filter(agenda => agenda.start_date > today);
        setAgendas(upcomingAgendas);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    fetchAgendas();
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedAgenda(null);
  };

  const cardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    margin: '10px',
  };

  const cardHeaderStyle = {
    backgroundColor: '#f5f5f5',
    borderBottom: '1px solid #ddd',
    padding: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const iconStyle = {
    cursor: 'pointer',
    fontSize: '1.3rem',
    marginLeft: '10px', // Added margin for spacing between icons
  };

  const editIconStyle = {
    color: '#007bff',
  };

  const deleteIconStyle = {
    color: '#dc3545',
  };

  const buttonStyle = {
    backgroundColor: '#00796B',
    color: '#ffffff',
    border: 'none',
    borderRadius: '5px',
    padding: '8px 10px',
    fontSize: '0.8rem',
    cursor: 'pointer',
    marginTop: '10px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'block',
  };

  if (showForm) {
    return (
      <Container className="mt-4">
        <h2>Edit Agenda</h2>
        <AgendaForm
          agendaId={selectedAgenda ? selectedAgenda.id : null}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </Container>
    );
  }

  if (agendas.length === 0) {
    return <p>No upcoming elections available.</p>;
  }

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Upcoming Elections</h2>
      {voteError && <p className="text-danger">{voteError}</p>}
      {deleteError && <p className="text-danger">{deleteError}</p>}
      <Row>
        {agendas.length > 0 ? (
          agendas.map((agenda) => (
            <Col xs={12} sm={6} md={6} lg={6} xl={6} key={agenda.id} className="mb-4">
              <Card className="custom-card" style={cardStyle}>
                <Card.Header style={cardHeaderStyle}>
                  <h5>{agenda.name}</h5>
                  {isSuperuser && (
                    <div className="card-actions">
                      <FaEdit onClick={() => handleEditClick(agenda)} style={{ ...iconStyle, ...editIconStyle }} />
                      <FaTrash onClick={() => handleDelete(agenda.id)} style={{ ...iconStyle, ...deleteIconStyle }} />
                    </div>
                  )}
                </Card.Header>
                <Card.Body>
                  <Card.Text>{agenda.description}</Card.Text>
                  <button style={buttonStyle} onClick={() => handleViewDetails(agenda.id)}>
                    View Details
                  </button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <Card>
              <Card.Body>No upcoming elections available.</Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    </Container>
  );
}

export default ElectionOptionUpcomming;

