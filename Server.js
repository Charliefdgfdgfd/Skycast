const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Replace with your actual AccuWeather API key
const ACCUWEATHER_API_KEY = 'l1MZN0QvGnCqoVImsZp0yFQnjNslclKH';

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Weather route to get data from AccuWeather API
app.get('/weather', async (req, res) => {
    const city = req.query.city;

    if (!city) {
        return res.json({ error: 'City name is required.' });
    }

    try {
        // Step 1: Get location key for the city
        const locationResponse = await axios.get(`http://dataservice.accuweather.com/locations/v1/cities/search`, {
            params: {
                apikey: ACCUWEATHER_API_KEY,
                q: city
            }
        });

        if (locationResponse.data.length === 0) {
            return res.json({ error: 'City not found.' });
        }

        const locationKey = locationResponse.data[0].Key;

        // Step 2: Get current weather using location key
        const weatherResponse = await axios.get(`http://dataservice.accuweather.com/currentconditions/v1/${locationKey}`, {
            params: {
                apikey: ACCUWEATHER_API_KEY
            }
        });

        const currentWeather = weatherResponse.data[0];

        // Step 3: Send formatted weather data back to the client
        res.json({
            temperature: currentWeather.Temperature.Metric.Value,
            weatherText: currentWeather.WeatherText
        });

    } catch (error) {
        console.error('Error fetching weather:', error);
        res.status(500).json({ error: 'Error fetching weather data.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`SkyCast server is running on port ${PORT}`);
});
