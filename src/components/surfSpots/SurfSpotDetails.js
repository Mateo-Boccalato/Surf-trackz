import { useState, useEffect } from 'react';
import {
    Box,
    VStack,
    Heading,
    Text,
    Spinner,
    Grid,
    GridItem,
    Card,
    CardBody,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
} from '@chakra-ui/react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export function SurfSpotDetails({ spot, forecast }) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('SurfSpotDetails received forecast:', forecast);
        setLoading(false);
    }, [forecast]);

    // Chart options
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Surf Forecast',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    // Prepare chart data
    const prepareChartData = (forecast) => {
        console.log('Preparing chart data with forecast:', forecast);
        if (!Array.isArray(forecast)) {
            console.log('No forecast data available');
            return null;
        }

        const chartData = {
            labels: forecast.map(hour => new Date(hour.time).toLocaleTimeString()),
            datasets: [
                {
                    label: 'Wave Height (m)',
                    data: forecast.map(hour => hour.waveHeight?.noaa),
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
                },
                {
                    label: 'Wind Speed (m/s)',
                    data: forecast.map(hour => hour.windSpeed?.noaa),
                    borderColor: 'rgb(255, 99, 132)',
                    tension: 0.1,
                }
            ],
        };
        console.log('Generated chart data:', chartData);
        return chartData;
    };

    const getCurrentConditions = (forecast) => {
        console.log('Getting current conditions from forecast:', forecast);
        if (!Array.isArray(forecast) || forecast.length === 0) {
            console.log('No current conditions available');
            return null;
        }
        const conditions = forecast[0];
        console.log('Current conditions:', conditions);
        return {
            waveHeight: conditions.waveHeight?.noaa,
            windSpeed: conditions.windSpeed?.noaa,
            windDirection: conditions.windDirection?.noaa
        };
    };

    const currentConditions = getCurrentConditions(forecast);
    const chartData = prepareChartData(forecast);

    if (loading) {
        return <Spinner />;
    }

    return (
        <Box p={4}>
            <VStack spacing={6} align="stretch">
                <Heading size="lg">{spot.name}</Heading>
                
                {/* Current Conditions */}
                <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                    <GridItem>
                        <Card>
                            <CardBody>
                                <Stat>
                                    <StatLabel>Wave Height</StatLabel>
                                    <StatNumber>
                                        {currentConditions?.waveHeight != null 
                                            ? `${currentConditions.waveHeight.toFixed(1)}m` 
                                            : 'N/A'}
                                    </StatNumber>
                                    <StatHelpText>Current</StatHelpText>
                                </Stat>
                            </CardBody>
                        </Card>
                    </GridItem>
                    <GridItem>
                        <Card>
                            <CardBody>
                                <Stat>
                                    <StatLabel>Wind Speed</StatLabel>
                                    <StatNumber>
                                        {currentConditions?.windSpeed != null 
                                            ? `${currentConditions.windSpeed.toFixed(1)}m/s` 
                                            : 'N/A'}
                                    </StatNumber>
                                    <StatHelpText>Current</StatHelpText>
                                </Stat>
                            </CardBody>
                        </Card>
                    </GridItem>
                    <GridItem>
                        <Card>
                            <CardBody>
                                <Stat>
                                    <StatLabel>Wind Direction</StatLabel>
                                    <StatNumber>
                                        {currentConditions?.windDirection != null 
                                            ? `${currentConditions.windDirection.toFixed(0)}°` 
                                            : 'N/A'}
                                    </StatNumber>
                                    <StatHelpText>Current</StatHelpText>
                                </Stat>
                            </CardBody>
                        </Card>
                    </GridItem>
                </Grid>

                {/* Forecast Chart */}
                <Card>
                    <CardBody>
                        {chartData ? (
                            <Line options={chartOptions} data={chartData} />
                        ) : (
                            <Text>No forecast data available</Text>
                        )}
                    </CardBody>
                </Card>

                {/* Spot Information */}
                <Card>
                    <CardBody>
                        <VStack align="start" spacing={2}>
                            <Text><strong>Location:</strong> {spot.latitude}°, {spot.longitude}°</Text>
                            <Text><strong>Last Updated:</strong> {new Date(spot.lastUpdated).toLocaleString()}</Text>
                        </VStack>
                    </CardBody>
                </Card>
            </VStack>
        </Box>
    );
} 