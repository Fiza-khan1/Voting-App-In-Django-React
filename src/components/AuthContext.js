import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'));
  const [user, setUser] = useState({
    username: localStorage.getItem('username') || '',
    profile_picture: localStorage.getItem('profile_picture') || null,
  });

  const login = (token) => {
    localStorage.setItem('authToken', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('profile_picture');
    setIsAuthenticated(false);
    setUser({
      username: '',
      profile_picture: null,
    });
  };

  const updateUserProfile = (profileData) => {
    setUser(profileData);
    localStorage.setItem('username', profileData.username);
    localStorage.setItem('profile_picture', profileData.profile_picture);
  };

  useEffect(() => {
    if (isAuthenticated) {
      const fetchProfileData = async () => {
        const token = localStorage.getItem('authToken');
        try {
          const response = await fetch('http://127.0.0.1:8000/profile/', {
            headers: {
              'Authorization': `Token ${token}`,
            },
          });

          if (response.ok) {
            const profileData = await response.json();
            updateUserProfile(profileData);
          } else {
            console.error('Failed to fetch profile:', await response.json());
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };

      fetchProfileData();
    }
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
