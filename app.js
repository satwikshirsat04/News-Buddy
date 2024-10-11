const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Route for homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});



// Start the server
const port = 3001;
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

// Connect to MySQL Database
const db = mysql.createConnection({
    host: '127.0.0.1', // Use '127.0.0.1' for localhost
    port: 3306,        // MySQL default port
    user: 'root',      // Your MySQL username
    password: 'Satprik.04', // Your MySQL password
    database: 'USER_INFO'    // Your database name
});


db.connect((err) => {
    if (err) {
        console.log('Error connecting to the database:', err);
    } else {
        console.log('Connected to the database');
    }
});

// Register User Endpoint
app.post('/register', (req, res) => {
    console.log('Received registration request:', req.body);
    const { username, email, password } = req.body; // Make sure these match your form
    const hashedPassword = bcrypt.hashSync(password, 10);

    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.query(query, [username, email, hashedPassword], (err, result) => {
        if (err) {
            // console.error(err); // Log the error for debugging
            return res.status(500).json({ message: 'Database error' });
        }
        res.status(200).json({ message: 'User registered successfully', redirectUrl: '/login.html'});
    });
});




// Login User Endpoint
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });

        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = results[0];
        const isPasswordValid = bcrypt.compareSync(password, user.password);

        if (isPasswordValid) {
            // Redirect to home page after successful login
            res.status(200).json({ message: 'Login successful', redirectUrl: '/index.html' }); // Return the URL to redirect
        } else {
            res.status(401).json({ message: 'Invalid password' });
        }
    });
});


app.listen(3000, () => {
    console.log('Server running on port 3000');
});
