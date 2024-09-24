import React, { useState, useEffect } from 'react';
import './CssFolder/profile.css'; // Import your custom CSS
import { useAuth } from './AuthContext';

const UserProfile = () => {
  const [user, setUser] = useState({
    profilePicture: '',
    name: '',
    email: '',
    bio: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);
  const { token } = useAuth(); // Assume token is available from context or state

  useEffect(() => {
    // Fetch user profile data when component mounts
    const fetchProfile = async () => {
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
        } else {
          console.error('Failed to fetch profile:', await response.json());
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? URL.createObjectURL(files[0]) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/profile/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        setIsEditing(false);
      } else {
        console.error('Failed to update profile:', await response.json());
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container">
      <div className="profile-card">
        <img src={user.profilePicture} alt="Profile" className="profile-img" />
        {isEditing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="profilePicture">Profile Picture</label>
              <input
                type="file"
                id="profilePicture"
                name="profilePicture"
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="btn btn-primary">Save</button>
            <button type="button" onClick={() => setIsEditing(false)} className="btn btn-secondary">Cancel</button>
          </form>
        ) : (
          <div className="profile-info">
            <h2 className="profile-name">{user.name}</h2>
            <p className="profile-email">{user.email}</p>
            <p className="profile-bio">{user.bio}</p>
            <button onClick={() => setIsEditing(true)} className="btn btn-primary">Edit Profile</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
