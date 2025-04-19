import './assets/css/App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/auth';
import AdminLayout from './layouts/admin';
import {
  ChakraProvider,
} from '@chakra-ui/react';
import initialTheme from './theme/theme'; // { themeGreen }
import { useState } from 'react';
import { AuthProvider, useAuth } from 'contexts/AuthContext';

// Create a protected route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  // TEMPORARY: Always allow access in development - REMOVE IN PRODUCTION
  return children;

  /* UNCOMMENT THIS IN PRODUCTION
  if (!user) {
    return <Navigate to="/auth/sign-in" replace />;
  }
  
  return children;
  */
};

export default function Main() {
  // eslint-disable-next-line
  const [currentTheme, setCurrentTheme] = useState(initialTheme);

  return (
    <ChakraProvider theme={currentTheme}>
      <AuthProvider>
        <Routes>
          <Route path="auth/*" element={<AuthLayout />} />
          <Route
            path="admin/*"
            element={
              <ProtectedRoute>
                <AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/auth/sign-in" replace />} />
        </Routes>
      </AuthProvider>
    </ChakraProvider>
  );
}
