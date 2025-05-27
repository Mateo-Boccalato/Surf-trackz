import { useState } from 'react';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    VStack,
    useToast,
    Heading,
} from '@chakra-ui/react';
import { surfSpotService } from '../../services/surfSpotService';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function AddSurfSpotForm() {
    const [name, setName] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            // Validate coordinates
            const lat = parseFloat(latitude);
            const lng = parseFloat(longitude);

            if (isNaN(lat) || lat < -90 || lat > 90) {
                throw new Error('Latitude must be between -90 and 90 degrees');
            }

            if (isNaN(lng) || lng < -180 || lng > 180) {
                throw new Error('Longitude must be between -180 and 180 degrees');
            }

            const spotData = {
                name,
                latitude: lat,
                longitude: lng,
                userId: user.$id,
            };

            await surfSpotService.createSurfSpot(spotData);
            toast({
                title: 'Surf spot added successfully',
                status: 'success',
                duration: 3000,
            });
            
            // Navigate back to the spots list
            navigate('/');
        } catch (error) {
            toast({
                title: 'Error adding surf spot',
                description: error.message,
                status: 'error',
                duration: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box maxW="md" mx="auto">
            <Heading size="lg" mb={6}>Add New Surf Spot</Heading>
            <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                    <FormControl isRequired>
                        <FormLabel>Spot Name</FormLabel>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter spot name"
                        />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Latitude</FormLabel>
                        <Input
                            type="number"
                            step="any"
                            value={latitude}
                            onChange={(e) => setLatitude(e.target.value)}
                            placeholder="Enter latitude"
                        />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Longitude</FormLabel>
                        <Input
                            type="number"
                            step="any"
                            value={longitude}
                            onChange={(e) => setLongitude(e.target.value)}
                            placeholder="Enter longitude"
                        />
                    </FormControl>
                    <Button
                        type="submit"
                        colorScheme="blue"
                        width="100%"
                        isLoading={loading}
                    >
                        Add Surf Spot
                    </Button>
                </VStack>
            </form>
        </Box>
    );
} 