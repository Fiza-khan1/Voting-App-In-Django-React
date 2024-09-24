import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';
import './Footer.css'; // Ensure custom CSS file is correctly imported

function Footer() {
  return (
    <footer className="footer bg-dark text-light py-1">
      <Container>
        <Row className="text-center">
          <Col xs={12} className="mb-1">
            <p className="mb-1">
              &copy; {new Date().getFullYear()} Your Company Name
            </p>
          </Col>
          <Col xs={12} className="mb-1">
            <ul className="list-inline mb-0">
              <li className="list-inline-item"><Link to="/" className="text-light">Home</Link></li>
              <li className="list-inline-item"><Link to="/about" className="text-light">About</Link></li>
              <li className="list-inline-item"><Link to="/contact" className="text-light">Contact</Link></li>
              <li className="list-inline-item"><Link to="/privacy" className="text-light">Privacy</Link></li>
            </ul>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
