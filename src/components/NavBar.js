import React, { useState } from 'react';
import {
    Box,
    Flex,
    Heading,
    Button,
    useColorModeValue,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Text,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const NavBar = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const bgColor = useColorModeValue('blue.500', 'blue.200');
    const textColor = useColorModeValue('white', 'gray.800');
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const handleLogoutClick = () => {
        setIsLogoutModalOpen(true);
    };

    const handleLogoutConfirm = async () => {
        try {
            await logout();
            setIsLogoutModalOpen(false);
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleLogoutCancel = () => {
        setIsLogoutModalOpen(false);
    };

    return (
        <>
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
                            onClick={() => navigate('/')}
                        >
                            My Spots
                        </Button>
                        <Button
                            colorScheme="whiteAlpha"
                            variant="ghost"
                            color={textColor}
                            _hover={{ bg: 'whiteAlpha.300' }}
                            onClick={() => navigate('/add-spot')}
                        >
                            Add New Spot
                        </Button>
                        <Button
                            colorScheme="whiteAlpha"
                            variant="outline"
                            color={textColor}
                            _hover={{ bg: 'whiteAlpha.300' }}
                            onClick={handleLogoutClick}
                        >
                            Sign Out
                        </Button>
                    </Flex>
                </Flex>
            </Box>

            {/* Logout Confirmation Modal */}
            <Modal isOpen={isLogoutModalOpen} onClose={handleLogoutCancel}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Sign Out</ModalHeader>
                    <ModalBody>
                        <Text>Are you sure you want to sign out?</Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="gray" mr={3} onClick={handleLogoutCancel}>
                            No
                        </Button>
                        <Button colorScheme="blue" onClick={handleLogoutConfirm}>
                            Yes
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default NavBar; 