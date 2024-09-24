import React from 'react';
import { Container, ListGroup } from 'react-bootstrap';
import './CssFolder/NotificationsPage.css'; // Custom CSS for styling

function NotificationPage({ notifications = [] }) {
  return (
    <Container className="notification-page-container">
      <h2>Notifications</h2>
      <ListGroup>
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <ListGroup.Item key={index} className="d-flex align-items-center">
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
              <span className="ms-2">{notification.message}</span>
            </ListGroup.Item>
          ))
        ) : (
          <ListGroup.Item>No new notifications</ListGroup.Item>
        )}
      </ListGroup>
    </Container>
  );
}

export default NotificationPage;
