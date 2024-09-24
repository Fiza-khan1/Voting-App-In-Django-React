import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Assuming you have an AuthContext to manage authentication
import './CssFolder/LandingPage.css';

function LandingPage() {
  const { isAuthenticated } = useAuth(); // Check if the user is authenticated
  const navigate = useNavigate();
 

  useEffect(() => {
   
      // Redirect to dashboard if user is authenticated
      navigate('/dashboard');
    
  }, [isAuthenticated, navigate]);

  return (
    <div className="landing-container">
      <header className="landing-header">
        <h1>Welcome to Our Voting System</h1>
        <p>Your vote matters. Make your voice heard!</p>
        {!isAuthenticated && (
          <div className="landing-buttons">
            <Link to="/login" className="btn btn-primary">Login</Link>
            <Link to="/signup" className="btn btn-secondary">Sign Up</Link>
          </div>
        )}
      </header>

      <section className="features-section">
        <h2>Why Choose Our Voting System?</h2>
        <div className="features">
          <div className="feature">
            <h3>Secure and Reliable</h3>
            <p>Our platform ensures the utmost security for your votes with cutting-edge encryption.</p>
          </div>
          <div className="feature">
            <h3>User-Friendly Interface</h3>
            <p>Navigate our system effortlessly with a simple and intuitive interface designed for everyone.</p>
          </div>
          <div className="feature">
            <h3>Real-Time Results</h3>
            <p>Stay updated with real-time election results as soon as voting ends.</p>
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <h2>What Our Users Say</h2>
        <div className="testimonials">
          <div className="testimonial">
            <p>"The best voting experience I've ever had! It was so easy to use."</p>
            <p>- John Doe</p>
          </div>
          <div className="testimonial">
            <p>"I felt secure knowing my vote was handled with care and privacy."</p>
            <p>- Jane Smith</p>
          </div>
          <div className="testimonial">
            <p>"Real-time results kept me on the edge of my seat. Fantastic system!"</p>
            <p>- Alex Johnson</p>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <p>&copy; 2024 Our Voting System. All rights reserved.</p>
        <div className="footer-links">
          <Link to="/contact">Contact Us</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
