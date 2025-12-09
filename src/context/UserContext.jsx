import { createContext, useContext, useState, useEffect } from 'react'
import {
  onAuthStateChanged,
  signOut,
} from 'firebase/auth'
import { auth } from '../config/firebase'
import api from '../config/api'

const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'))
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken'))

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // User is signed in - create/get user in backend with JWT tokens
        try {
          const response = await api.post('/users', {
            email: currentUser.email,
            displayName: currentUser.displayName || currentUser.email.split('@')[0],
            photoURL: currentUser.photoURL || '',
          });

          setUser(response.data.user);
          setAccessToken(response.data.accessToken);
          setRefreshToken(response.data.refreshToken);

          // Store tokens in localStorage
          localStorage.setItem('accessToken', response.data.accessToken);
          localStorage.setItem('refreshToken', response.data.refreshToken);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        } catch (err) {
          console.error('Failed to sync user with backend:', err);
          setError(err.message);
          setUser(currentUser);
        }
      } else {
        // User is signed out
        setUser(null);
        setAccessToken(null);
        setRefreshToken(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
      setLoading(false);
    }, (err) => {
      setError(err.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      setError(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    } catch (err) {
      setError(err.message);
    }
  };

  const refreshAccessToken = async () => {
    try {
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post('/users/refresh-token', { refreshToken });
      const newAccessToken = response.data.accessToken;

      setAccessToken(newAccessToken);
      localStorage.setItem('accessToken', newAccessToken);

      return newAccessToken;
    } catch (err) {
      console.error('Token refresh failed:', err);
      // If refresh fails, logout user
      await logout();
      throw err;
    }
  };

  const value = {
    user,
    loading,
    error,
    logout,
    isAuthenticated: !!user,
    accessToken,
    refreshToken,
    refreshAccessToken,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
