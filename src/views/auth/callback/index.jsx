import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Spinner, useToast } from '@chakra-ui/react';
import { useAuth } from 'contexts/AuthContext';

function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { signInWithGoogle } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(location.search);
      const code = params.get('code');
      const error = params.get('error');

      if (error) {
        toast({
          title: "Authentication Error",
          description: "Failed to sign in with Google.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        navigate('/auth/sign-in');
        return;
      }

      if (!code) {
        navigate('/auth/sign-in');
        return;
      }

      try {
        const codeVerifier = localStorage.getItem('code_verifier');
        if (!codeVerifier) {
          throw new Error('Code verifier not found');
        }

        const success = await signInWithGoogle(code, codeVerifier);
        if (success) {
          navigate('/admin/dashboard');
        } else {
          throw new Error('Authentication failed');
        }
      } catch (error) {
        toast({
          title: "Authentication Error",
          description: "Failed to complete sign in. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        navigate('/auth/sign-in');
      } finally {
        // Clean up
        localStorage.removeItem('code_verifier');
      }
    };

    handleCallback();
  }, [location, navigate, toast, signInWithGoogle]);

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
    >
      <Spinner size="xl" />
    </Box>
  );
}

export default AuthCallback; 