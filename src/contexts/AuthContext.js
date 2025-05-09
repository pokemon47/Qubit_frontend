import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// TEMPORARY: Development mock user data - REMOVE IN PRODUCTION
const MOCK_USER = {
  email: 'dev@example.com',
  name: 'Development User',
  picture: 'https://via.placeholder.com/150',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TEMPORARY: Skip auth check in development - REMOVE IN PRODUCTION
    setUser(MOCK_USER);
    setLoading(false);

    /* UNCOMMENT THIS IN PRODUCTION
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/verify', {
          credentials: 'include',
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
    */
  }, []);

  const signInWithGoogle = async (code, codeVerifier) => {
    // TEMPORARY: Auto-login in development - REMOVE IN PRODUCTION
    setUser(MOCK_USER);
    return true;

    /* UNCOMMENT THIS IN PRODUCTION
    try {
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          code,
          code_verifier: codeVerifier,
        }),
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const userData = await response.json();
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Google sign in failed:', error);
      return false;
    }
    */
  };

  const signOut = async () => {
    // TEMPORARY: Simple logout in development - REMOVE IN PRODUCTION
    setUser(null);
    return true;

    /* UNCOMMENT THIS IN PRODUCTION
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
      return true;
    } catch (error) {
      console.error('Sign out failed:', error);
      return false;
    }
    */
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};