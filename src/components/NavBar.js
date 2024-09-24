import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import Badge from 'react-bootstrap/Badge';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { FaBell } from 'react-icons/fa';
import { BsCaretDown } from "react-icons/bs";
import { formatDistanceToNow } from 'date-fns';
import './CssFolder/NavBar.css';

function NavBar() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotificationCount, setShowNotificationCount] = useState(true);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      const token = localStorage.getItem('authToken');

      const fetchProfileData = async () => {
        try {
          const response = await fetch('http://127.0.0.1:8000/profile/', {
            headers: { 'Authorization': `Token ${token}` },
          });

          if (response.ok) {
            const profileData = await response.json();
            setProfileImage(profileData.profile_picture ? `http://127.0.0.1:8000${profileData.profile_picture}` : null);
            localStorage.setItem('username', profileData.username);
            localStorage.setItem('is_superuser', profileData.is_superuser);
          } else {
            console.error('Failed to fetch profile:', await response.json());
          }
        } catch (error) {
          console.error('Error fetching profile data:', error);
        }
      };

      fetchProfileData();

      const wsUrl = `ws://127.0.0.1:9000/ws/notification/?token=${token}`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log("WebSocket connection established.");
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'user_vote_notification' || data.type === 'new_vote_notification') {
          const username = data.type === 'new_vote_notification'
            ? extractUsernameFromMessage(data.message)
            : localStorage.getItem('username') || 'Anonymous';

          const profilePicture = data.profile_picture ? `http://127.0.0.1:8000${data.profile_picture}` : null;
          const avatarLetter = !profilePicture ? getAvatarLetter(username) : null;

          setNotifications((prevNotifications) => [
            ...prevNotifications,
            {
              message: data.message,
              profilePicture,
              avatarLetter,
              timestamp: data.timestamp,
            },
          ]);
          setShowNotificationCount(true);
        }
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed.");
      };

      return () => {
        ws.close();
      };
    }
  }, [isAuthenticated, user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDropdownClick = () => {
    setShowNotificationCount(false);
  };

  const extractUsernameFromMessage = (message) => {
    const parts = message.split(' ');
    return parts[0] || 'Anonymous';
  };

  const getAvatarLetter = (username) => {
    return username.charAt(0).toUpperCase();
  };

  return (
    <Navbar style={{ position: 'relative' }} bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/">Voting-App</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto"></Nav>
          <Nav className="d-flex align-items-center">
            {isAuthenticated ? (
              <>
                <Dropdown align="end" onClick={handleDropdownClick}>
                  <Dropdown.Toggle className="transparent-dropdown-toggle" id="dropdown-notifications">
                    <FaBell style={{ fontSize: '1.5rem' }} />
                    {showNotificationCount && notifications.length > 0 && (
                      <Badge bg="danger" className="notification-badge">
                        {notifications.length}
                      </Badge>
                    )}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {notifications.length > 0 ? (
                      notifications.map((notification, index) => (
                        <Dropdown.Item key={index} className="notification-item">
                          <div className="d-flex align-items-center">
                            {notification.profilePicture ? (
                              <img
                                src={notification.profilePicture}
                                alt="Profile"
                                className="notification-profile-picture"
                              />
                            ) : (
                              <div className="notification-avatar">
                                {notification.avatarLetter}
                              </div>
                            )}
                            <div className="ms-2 notification-content">
                              <div className="notification-message">
                                <strong>{notification.username}</strong>
                                {notification.message.replace(notification.username, '')}
                              </div>
                              {notification.timestamp && (
                                <span className="notification-timestamp">
                                  {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                                </span>
                              )}
                            </div>
                          </div>
                        </Dropdown.Item>
                      ))
                    ) : (
                      <Dropdown.Item>No new notifications</Dropdown.Item>
                    )}
                  </Dropdown.Menu>
                </Dropdown>

                <Dropdown align="end">
                  <Dropdown.Toggle className="transparent-dropdown-toggle" id="dropdown-settings">
                    <BsCaretDown style={{ fontSize: '1.5rem' }} />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                    <Dropdown.Item href="/contact">Contact</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

                <Link to="/profile">
                  <div className="avatar-container">
                    {profileImage ? (
                      <img
                        src={profileImage.startsWith('http') ? profileImage : `http://127.0.0.1:8000${profileImage}`}
                        alt="Profile"
                        className="avatar-image"
                      />
                    ) : (
                      <div className="avatar-circle">{user.username.charAt(0).toUpperCase()}</div>
                    )}
                  </div>
                </Link>
              </>
            ) : (
              <>
                <Link to="/signup">
                  <Button variant="outline-light" className="me-2">Sign Up</Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline-light">Login</Button>
                </Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
