const express = require("express");
const bodyParser = require("body-parser");
const sql = require('mssql');
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
});

connection.connect(err => {
    if (err) throw err;
    console.log('Connected to the database!');
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Add this line to handle JSON requests

// Setting up DB connection
const config = {
    user: 'event',
    password: 'Lama123!',
    server: 'event-key.database.windows.net', // SQL Server host without port
    database: 'EventKey',
    options: {
        port: 1433, // SQL Server port
        encrypt: true, // Use this for Azure SQL
        trustServerCertificate: false, // Change to true if you want to trust the server certificate
    }
};

// Middleware to connect to the database
const connectToDatabase = async () => {
    try {
        await sql.connect(config);
        console.log('Connected to SQL Server');
    } catch (err) {
        console.error('Database connection failed:', err);
    }
};

connectToDatabase();

// Test route
app.get("/print", (req, res) => {
    res.send("Hello World!");
});

// Route to fetch users
app.get("/users", async (req, res) => {
    try {
        const result = await sql.query('SELECT * FROM [user]'); // Change 'user' to your actual table name
        res.json(result.recordset); // Send the results as JSON
    } catch (err) {
        return res.status(500).send('Error retrieving data');
    }
});

// Route to fetch products
app.get("/explore", async (req, res) => {
    try {
        const result = await sql.query('SELECT * FROM products'); // Ensure 'products' table exists
        res.json(result.recordset); // Send the results as JSON
    } catch (err) {
        return res.status(500).send('Error retrieving data');
    }
});

// Activating server 
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});