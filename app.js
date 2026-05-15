require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const axios = require('axios');
const reportRoutes = require('./routes/reportRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB using Mongoose
const MONGODB_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cavesentry';
mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Use express.urlencoded for form parsing
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Use the routes defined in routes/reportRoutes.js for the root path
app.use('/', reportRoutes);

// Dedicated route to fetch OpenWeather API data for 'Yucatan'
app.get('/weather', async (req, res) => {
    try {
        const location = 'Yucatan';
        const apiKey = process.env.WEATHER_API_KEY;
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

        const response = await axios.get(weatherUrl);
        const weatherData = response.data;

        // Render the 'weather' view and pass the data
        res.render('weather', { weather: weatherData, location });
    } catch (err) {
        console.error('Error fetching weather data:', err.message);
        console.log('Providing fallback weather data since the API key is currently invalid.');

        // Fallback mock data in case the API key isn't active yet
        const mockWeatherData = {
            main: { temp: 28.5 },
            weather: [{ description: 'partly cloudy' }]
        };

        res.render('weather', { weather: mockWeatherData, location: 'Yucatan' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`CaveSentry scanning the depths on port ${PORT}`);
});