const express = require("express");
const bodyParser = require("body-parser"); // Import body-parser
const mysql = require("mysql");
const cors = require('cors');

const app = express();
const port = 3000; // or any other desired port

app.use(cors()); // Enable CORS for all routes
// Setting up DB connection
const connection = mysql.createConnection({
    host: 'localhost', // MySQL host
    user: 'root',
    password: '',
    database: 'eventKey'
    port: 3306,
});

connection.connect(err => {
    if (err) throw err;
    console.log('Connected to the database!');
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Test route
app.get("/print", (req, res) => {
    res.send("Hello World!");
});

app.get("/", (req, res) => {
    const query = 'SELECT * FROM user'; // Change 'Users' to your actual table name

    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).send('Error retrieving data');
        }
        res.json(results); // Send the results as JSON
    });
});
app.get("/explore", (req, res) => {
    const query = 'SELECT * FROM products'; // Change 'Users' to your actual table name

    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).send('Error retrieving data');
        }
        res.json(results); // Send the results as JSON
    });
});

// Activating server 
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});