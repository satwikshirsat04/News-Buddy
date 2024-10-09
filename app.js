const express = require('express');
const path = require('path');
const app = express();

// app.use(express.static('public'));



// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Route for homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

const cors = require('cors');
app.use(cors());

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});


// API FETCHING
const axios = require('axios');

// Route for fetching news
app.get('/news/:country', async (req, res) => {
    const country = req.params.country;
    const apiKey = '882018946f184144b4d62a853d046f4c';
    const url = `https://newsapi.org/v2/top-headlines?country=${country}&pageSize=10&apiKey=${apiKey}`;
    
    try {
        const response = await axios.get(url);
        console.log(response.data); 
        res.json(response.data.articles); // Send news articles back to frontend
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching news');
    }
});

