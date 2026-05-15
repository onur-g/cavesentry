const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const axios = require('axios');

// GET route to fetch all reports from MongoDB and render them to 'index' view
router.get('/', async (req, res) => {
    try {
        const reports = await Report.find().sort({ createdAt: -1 });
        
        let weatherData = null;
        const location = 'Yucatan';
        
        // Attempt to fetch real weather, fallback to identical mock if API fails
        try {
            const apiKey = process.env.WEATHER_API_KEY;
            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
            const response = await axios.get(weatherUrl);
            weatherData = response.data;
        } catch (weatherErr) {
            weatherData = {
                main: { temp: 28.5 },
                weather: [{ description: 'partly cloudy' }]
            };
        }

        res.render('index', { reports, weather: weatherData, location });
    } catch (err) {
        console.error("Error fetching reports:", err);
        res.status(500).send("An error occurred while fetching reports.");
    }
});

// POST route to receive form data, save a new Report to MongoDB, and redirect back to home
router.post('/', async (req, res) => {
    try {
        const { diverName, location, advice, dangerLevel } = req.body;
        
        const newReport = new Report({
            diverName,
            location,
            advice,
            dangerLevel
        });

        await newReport.save();
        res.redirect('/');
    } catch (err) {
        console.error("Error saving report:", err);
        res.status(500).send("An error occurred while saving the report.");
    }
});

module.exports = router;
