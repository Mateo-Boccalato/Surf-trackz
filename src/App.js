import React from 'react';
import { ChakraProvider, Box } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { AddSurfSpotForm } from './components/surfSpots/AddSurfSpotForm';
import { SurfSpotsList } from './components/surfSpots/SurfSpotsList';
import NavBar from './components/NavBar';

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user) {
        return <Navigate to="/login" />;
    }
    return children;
};

const MainContent = () => {
    return (
        <Box pt="80px" px={4} maxW="1200px" mx="auto">
            <AddSurfSpotForm />
            <Box mt={8}>
                <SurfSpotsList />
            </Box>
        </Box>
    );
};

const App = () => {
    return (
        <ChakraProvider>
            <AuthProvider>
                <Router>
                    <Routes>
                        <Route path="/login" element={<LoginForm />} />
                        <Route path="/register" element={<RegisterForm />} />
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <>
                                        <NavBar />
                                        <MainContent />
                                    </>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/spots"
                            element={
                                <ProtectedRoute>
                                    <>
                                        <NavBar />
                                        <MainContent />
                                    </>
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </Router>
            </AuthProvider>
        </ChakraProvider>
    );
};

export default App; 