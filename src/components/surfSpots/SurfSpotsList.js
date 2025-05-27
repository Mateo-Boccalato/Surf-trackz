import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    VStack,
    Text,
    useToast,
    SimpleGrid,
    Card,
    CardBody,
    CardHeader,
    CardFooter,
    Heading,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    HStack,
} from '@chakra-ui/react';
import { surfSpotService } from '../../services/surfSpotService';
import { useAuth } from '../../contexts/AuthContext';
import { SurfSpotDetails } from './SurfSpotDetails';

export function SurfSpotsList() {
    const [spots, setSpots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSpot, setSelectedSpot] = useState(null);
    const [forecast, setForecast] = useState(null);
    const { user } = useAuth();
    const toast = useToast();

    useEffect(() => {
        loadSurfSpots();
    }, [user]);

    const loadSurfSpots = async () => {
        try {
            const userSpots = await surfSpotService.getUserSurfSpots(user.$id);
            console.log('Loaded user spots:', userSpots);
            setSpots(userSpots);
        } catch (error) {
            console.error('Error loading spots:', error);
            toast({
                title: 'Error loading surf spots',
                description: error.message,
                status: 'error',
                duration: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (spotId) => {
        try {
            await surfSpotService.deleteSurfSpot(spotId);
            setSpots(spots.filter(spot => spot.$id !== spotId));
            toast({
                title: 'Surf spot deleted',
                status: 'success',
                duration: 3000,
            });
        } catch (error) {
            console.error('Error deleting spot:', error);
            toast({
                title: 'Error deleting surf spot',
                description: error.message,
                status: 'error',
                duration: 3000,
            });
        }
    };

    const handleSpotClick = async (spot) => {
        try {
            console.log('Handling spot click for:', spot);
            setSelectedSpot(spot);
            // Load forecast data when a spot is selected
            const forecastData = await surfSpotService.getForecast(spot.$id);
            console.log('Received forecast data:', forecastData);
            setForecast(forecastData);
        } catch (error) {
            console.error('Error loading forecast:', error);
            toast({
                title: 'Error loading forecast',
                description: error.message,
                status: 'error',
                duration: 3000,
            });
        }
    };

    if (loading) {
        return <Text>Loading...</Text>;
    }

    return (
        <Box p={4}>
            <VStack spacing={4} align="stretch">
                <Heading size="lg">My Surf Spots</Heading>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                    {spots.map((spot) => (
                        <Card key={spot.$id} cursor="pointer" onClick={() => handleSpotClick(spot)}>
                            <CardHeader>
                                <Heading size="md">{spot.name}</Heading>
                            </CardHeader>
                            <CardBody>
                                <Text>Latitude: {spot.latitude}</Text>
                                <Text>Longitude: {spot.longitude}</Text>
                                <Text>Last Updated: {new Date(spot.lastUpdated).toLocaleDateString()}</Text>
                            </CardBody>
                            <CardFooter>
                                <HStack spacing={4} width="100%">
                                    <Button
                                        colorScheme="blue"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleSpotClick(spot);
                                        }}
                                        flex={1}
                                    >
                                        View Forecast
                                    </Button>
                                    <Button
                                        colorScheme="red"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(spot.$id);
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </HStack>
                            </CardFooter>
                        </Card>
                    ))}
                </SimpleGrid>
            </VStack>

            {/* Surf Spot Details Modal */}
            <Modal isOpen={selectedSpot !== null} onClose={() => setSelectedSpot(null)} size="xl">
                <ModalOverlay />
                <ModalContent maxW="90vw">
                    <ModalHeader>{selectedSpot?.name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {selectedSpot && (
                            <SurfSpotDetails spot={selectedSpot} forecast={forecast} />
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
} 