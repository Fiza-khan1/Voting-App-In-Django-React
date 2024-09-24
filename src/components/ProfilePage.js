import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext'; // Import AuthContext
import { FaEdit } from 'react-icons/fa'; // Import edit icon

const UserProfile = () => {
  const { isAuthenticated, updateUserProfile } = useAuth(); // Add updateUserProfile
  const [user, setUser] = useState({
    profile_picture: '',
    username: '',
    email: '',
    bio: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);
  const [previewPicture, setPreviewPicture] = useState('');

  const fetchProfile = async () => {
    const token = localStorage.getItem('authToken');
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
        setPreviewPicture(
          profileData.profile_picture
            ? `http://127.0.0.1:8000${profileData.profile_picture}`
            : `https://ui-avatars.com/api/?name=${profileData.username}&background=random`
        );
        localStorage.setItem('username', profileData.username);
      } else {
        console.error('Failed to fetch profile:', await response.json());
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profile_picture' && files) {
      const file = files[0];
      setPreviewPicture(URL.createObjectURL(file)); // Preview the selected image
    }
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    const dataToUpdate = new FormData();

    dataToUpdate.append('bio', formData.bio);
    if (formData.profile_picture instanceof File) {
      dataToUpdate.append('profile_picture', formData.profile_picture);
    }
    dataToUpdate.append('email', formData.email);
    dataToUpdate.append('user', user.id);

    try {
      const response = await fetch('http://127.0.0.1:8000/profile/', {
        method: 'PUT',
        headers: {
          'Authorization': `Token ${token}`,
        },
        body: dataToUpdate,
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setUser(updatedProfile);
        setIsEditing(false);
        setPreviewPicture(
          updatedProfile.profile_picture
            ? `http://127.0.0.1:8000${updatedProfile.profile_picture}`
            : `https://ui-avatars.com/api/?name=${updatedProfile.username}&background=random`
        );
        localStorage.setItem('username', updatedProfile.username);
        updateUserProfile(updatedProfile); // Update context
      } else {
        console.error('Failed to update profile:', await response.text());
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPreviewPicture(
      user.profile_picture
        ? `http://127.0.0.1:8000${user.profile_picture}`
        : `https://ui-avatars.com/api/?name=${user.username}&background=random`
    );
  };

  return (
    <div style={containerProfileStyle}>
      <div style={profileCardStyle}>
        {/* Edit button placed absolutely in the top-right corner */}
        <div style={editButtonContainerStyle}>
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} style={btnEditStyle}>
              <FaEdit />
            </button>
          )}
        </div>

        <div style={avatarContainerStyle}>
          <img
            src={previewPicture}
            alt="Profile"
            style={profileImgStyle}
            onError={(e) =>
              (e.target.src = `https://ui-avatars.com/api/?name=${user.username}&background=random`)
            } // Fallback to avatar if image fails to load
          />
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} style={profileFormStyle}>
            <div style={formRowStyle}>
              <input
                type="file"
                id="profile_picture"
                name="profile_picture"
                onChange={handleChange}
                style={fileInputStyle}
              />
            </div>
            <div style={formRowStyle}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
            <div style={formRowStyle}>
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                style={textareaStyle}
              />
            </div>
            <div style={formButtonsStyle}>
              <button type="submit" style={btnSaveStyle}>
                Save
              </button>
              <button type="button" onClick={handleCancel} style={btnCancelStyle}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div style={profileInfoStyle}>
            <h2 style={profileUsernameStyle}>{user.username}</h2>
            <p style={profileEmailStyle}>{user.email || 'No email provided'}</p>
            <p style={profileBioStyle}>{user.bio || 'No bio available'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Inline styling
const containerProfileStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: '#f5f5f5',
  padding: '20px',
};

const profileCardStyle = {
  maxWidth: '600px',
  width: '100%',
  padding: '20px',
  borderRadius: '10px',
  backgroundColor: '#fff',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  textAlign: 'left',
  boxSizing: 'border-box',
  overflow: 'auto',
  position: 'relative', // Allow absolute positioning of child elements
};

const avatarContainerStyle = {
  display: 'flex',
  flexDirection: 'column', // Stack the image and button vertically
  alignItems: 'center', // Centers items horizontally
};

const profileImgStyle = {
  width: '100px', // Adjusted size for profile picture
  height: '100px',
  borderRadius: '50%',
  objectFit: 'cover',
};

const editButtonContainerStyle = {
  position: 'absolute',
  top: '10px',
  right: '10px',
};

const btnEditStyle = {
  border: 'none',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  fontSize: '22px',
  color: 'blue',
};

const profileFormStyle = {
  width: '100%',
};

const formRowStyle = {
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '10px',
};

const fileInputStyle = {
  width: '100%',
  marginBottom: '10px',
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #ddd',
  boxSizing: 'border-box',
};

const textareaStyle = {
  width: '100%',
  height: '150px', // Larger height for the bio textarea
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #ddd',
  boxSizing: 'border-box',
};

const formButtonsStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '10px',
};

const btnSaveStyle = {
  padding: '8px 16px',
  backgroundColor: '#28a745',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px',
};

const btnCancelStyle = {
  padding: '8px 16px',
  backgroundColor: '#dc3545',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px',
};

const profileInfoStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
};

const profileUsernameStyle = {
  fontSize: '24px',
  fontWeight: 'bold',
  marginBottom: '10px',
};

const profileEmailStyle = {
  fontSize: '18px',
  color: '#777',
  marginBottom: '10px',
};

const profileBioStyle = {
  fontSize: '16px',
  color: '#555',
};
export default UserProfile;
