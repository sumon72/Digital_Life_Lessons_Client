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
  const [userPlan, setUserPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'))
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken'))

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // User is signed in - sync with backend (MongoDB is single source of truth)
        try {
          const response = await api.post('/users', {
            email: currentUser.email,
            displayName: currentUser.displayName || currentUser.email.split('@')[0],
            photoURL: currentUser.photoURL || '',
          });

          // Always use the user data from MongoDB (single source of truth)
          const backendUser = response.data.user;
          
          setUser(backendUser);
          setUserPlan({
            isPremium: backendUser?.isPremium || false,
            premiumActivatedAt: backendUser?.premiumActivatedAt || null
          });
          setAccessToken(response.data.accessToken);
          setRefreshToken(response.data.refreshToken);

          // Store tokens in localStorage
          localStorage.setItem('accessToken', response.data.accessToken);
          localStorage.setItem('refreshToken', response.data.refreshToken);
          localStorage.setItem('user', JSON.stringify(backendUser));
          
          console.log('✓ User synced from MongoDB:', backendUser.email, '| Premium:', backendUser?.isPremium || false);
        } catch (err) {
          console.error('Failed to sync user with backend:', err);
          setError(err.message);
          setUser(currentUser);
        }
      } else {
        // User is signed out
        setUser(null);
        setUserPlan(null);
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
      setUserPlan(null);
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

  const refreshUser = async () => {
    try {
      // For regular users, fetch from backend and find by email
      // For admin users trying to refresh, we need a different approach
      if (user?.role === 'admin') {
        // Admin user - fetch their own data differently to avoid permission issues
        const response = await api.get(`/users/${user._id}`);
        const updatedUser = response.data;
        
        if (updatedUser) {
          setUser(updatedUser);
          setUserPlan({
            isPremium: updatedUser.isPremium || false,
            premiumActivatedAt: updatedUser.premiumActivatedAt || null
          });
          localStorage.setItem('user', JSON.stringify(updatedUser));
          console.log('✓ Admin user plan refreshed from MongoDB:', updatedUser.email, '| Premium:', updatedUser.isPremium || false);
        }
      } else {
        // Regular user - try to fetch user by their own ID first
        try {
          const response = await api.get(`/users/${user._id}`);
          const updatedUser = response.data;
          
          if (updatedUser) {
            setUser(updatedUser);
            setUserPlan({
              isPremium: updatedUser.isPremium || false,
              premiumActivatedAt: updatedUser.premiumActivatedAt || null
            });
            localStorage.setItem('user', JSON.stringify(updatedUser));
            console.log('✓ User plan refreshed from MongoDB:', updatedUser.email, '| Premium:', updatedUser.isPremium || false);
          }
        } catch (err) {
          console.error('Failed to refresh user data:', err);
        }
      }
    } catch (err) {
      console.error('Failed to refresh user data:', err);
    }
  };

  const value = {
    user,
    userPlan,
    loading,
    error,
    logout,
    refreshUser,
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
