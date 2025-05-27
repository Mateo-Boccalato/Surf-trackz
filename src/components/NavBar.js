import React from 'react';
import { Box, Flex, Heading, Button, useColorModeValue } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const NavBar = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const bgColor = useColorModeValue('blue.500', 'blue.200');
    const textColor = useColorModeValue('white', 'gray.800');

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <Box 
            as="nav" 
            bg={bgColor} 
            px={4} 
            py={3} 
            position="fixed" 
            w="100%" 
            top={0} 
            zIndex={1000}
            boxShadow="0 2px 4px rgba(0,0,0,0.1)"
        >
            <Flex maxW="1200px" mx="auto" align="center" justify="space-between">
                <Heading 
                    size="lg" 
                    color={textColor}
                    fontWeight="bold"
                    cursor="pointer"
                    onClick={() => navigate('/')}
                >
                    🌊 Surf Trackz
                </Heading>
                <Flex gap={4}>
                    <Button
                        colorScheme="whiteAlpha"
                        variant="ghost"
                        color={textColor}
                        _hover={{ bg: 'whiteAlpha.300' }}
                        onClick={() => navigate('/spots')}
                    >
                        My Spots
                    </Button>
                    <Button
                        colorScheme="whiteAlpha"
                        variant="outline"
                        color={textColor}
                        _hover={{ bg: 'whiteAlpha.300' }}
                        onClick={handleLogout}
                    >
                        Sign Out
                    </Button>
                </Flex>
            </Flex>
        </Box>
    );
};

export default NavBar; 