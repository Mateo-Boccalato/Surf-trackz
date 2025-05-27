import { useState } from 'react';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    VStack,
    Text,
    useToast,
    Link,
    FormHelperText,
} from '@chakra-ui/react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

export function RegisterForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic validation
        if (password.length < 8) {
            toast({
                title: 'Invalid password',
                description: 'Password must be at least 8 characters long',
                status: 'error',
                duration: 3000,
            });
            return;
        }

        try {
            setLoading(true);
            await register(email, password, name);
            toast({
                title: 'Account created successfully',
                status: 'success',
                duration: 3000,
            });
            navigate('/');
        } catch (error) {
            console.error('Registration error in form:', error);
            toast({
                title: 'Registration failed',
                description: error.message || 'An error occurred during registration',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box maxW="md" mx="auto" mt={8}>
            <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                    <FormControl isRequired>
                        <FormLabel>Name</FormLabel>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                        />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Email</FormLabel>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                        />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Password</FormLabel>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                        />
                        <FormHelperText>
                            Password must be at least 8 characters long
                        </FormHelperText>
                    </FormControl>
                    <Button
                        type="submit"
                        colorScheme="blue"
                        width="100%"
                        isLoading={loading}
                    >
                        Sign Up
                    </Button>
                    <Text>
                        Already have an account?{' '}
                        <Link as={RouterLink} to="/login" color="blue.500">
                            Login
                        </Link>
                    </Text>
                </VStack>
            </form>
        </Box>
    );
} 