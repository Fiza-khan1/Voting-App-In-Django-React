import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import "./CssFolder/currentElections.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

function CurrentElection() {
  const [elections, setElections] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSuperUser, setIsSuperUser] = useState(false);
  const [countdown, setCountdown] = useState({});

  useEffect(() => {
    const fetchElections = async () => {
      const token = localStorage.getItem("authToken");
      const superUserStatus = localStorage.getItem("is_superuser") === "true";

      setIsAuthenticated(!!token);
      setIsSuperUser(superUserStatus);

      try {
        const response = await fetch("http://127.0.0.1:8000/routers/Newagendas/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Token ${token}` }),
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            setIsAuthenticated(false);
            console.error("Unauthorized access. Please log in.");
            return;
          }
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        const today = new Date().toISOString().split("T")[0];

        const currentElections = data.filter(
          (election) =>
            new Date(election.start_date) <= new Date(today) &&
            new Date(election.end_date) >= new Date(today)
        );

        setElections(currentElections);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchElections();
  }, [isAuthenticated]);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(`http://127.0.0.1:8000/routers/Newagendas/${id}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Token ${token}` }),
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setIsAuthenticated(false);
          console.error("Unauthorized access. Please log in.");
          return;
        }
        throw new Error("Network response was not ok");
      }

      // Remove the deleted election from the state
      setElections(elections.filter((election) => election.id !== id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const calculateCountdown = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const totalSeconds = Math.max((end - now) / 1000, 0);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    return { hours, minutes, seconds };
  };

  useEffect(() => {
    const updateCountdown = () => {
      const updatedCountdown = elections.reduce((acc, election) => {
        const { hours, minutes, seconds } = calculateCountdown(election.end_date);
        acc[election.id] = { hours, minutes, seconds };
        return acc;
      }, {});
      setCountdown(updatedCountdown);
    };

    // Initial countdown update
    updateCountdown();

    // Set interval to update countdown every second
    const intervalId = setInterval(updateCountdown, 1000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, [elections]);

  return (
    <Container className="current-elections-page myclass">
      <h2 className="text-center mb-2" style={{ color: 'black' }}>Current Elections</h2>
      <Row className="g-4 justify-content-center">
        {elections.length > 0 ? (
          elections.map((election) => {
            const { hours, minutes, seconds } = countdown[election.id] || calculateCountdown(election.end_date);
            const totalHours = Math.floor(hours + (minutes / 60) + (seconds / 3600));

            return (
              <Col xs={12} md={6} lg={6} key={election.id} className="mb-4">
                <Card className="custom-card myCard">
                  <Card.Body className="card-body">
                    <div className="card-content">
                      <Row>
                        <Col xs={6}>
                          <Card.Title>{election.name}</Card.Title>
                        </Col>
                        <Col xs={6} className="text-end">
                          <p className="timer-text">
                            {totalHours}h {minutes}m {seconds}s remaining
                          </p>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <Card.Text><strong>Description:</strong> {election.description}</Card.Text>
                        </Col>
                      </Row>
                    </div>
                    <div className="card-footer">
                      {isSuperUser ? (
                        <div className="admin-actions">
                          <button
                            className="btn btn-outline-danger icon-btn"
                            onClick={() => handleDelete(election.id)}
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                          <Link to={`/vote/${election.id}`} className="btn btn-primary">
                            Vote Now
                          </Link>
                        </div>
                      ) : isAuthenticated ? (
                        <Link to={`/vote/${election.id}`} className="btn btn-primary">
                          Vote Now
                        </Link>
                      ) : (
                        <Link to="/login" className="btn btn-primary">
                          Login to Vote
                        </Link>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })
        ) : (
          <Col xs={12}>
            <Card>
              <Card.Body>
                <Card.Text>No current elections available.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    </Container>
  );
}

export default CurrentElection;
