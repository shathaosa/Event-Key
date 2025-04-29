const express = require("express");
const bodyParser = require("body-parser");
const sql = require('mssql');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const port = 3000; // or any other desired port

app.use(cors()); // Enable CORS for all routes
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
        const result = await sql.query('SELECT * FROM users'); // Change 'user' to your actual table name
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


async function insertUserEventProduct(userData, eventData, productVendors) {
  
    try {
 
        // Start a transaction
        const transaction = new sql.Transaction();
        await transaction.begin();

        try {
            const request = new sql.Request(transaction);

            // Check if the user already exists
            const userResult = await request.query`SELECT id FROM users WHERE email = ${userData.email}`;
            let userId;

            if (userResult.recordset.length > 0) {
                // User exists, get the user ID
                userId = userResult.recordset[0].id;
            } else {
                // User does not exist, insert new user
                const insertUserResult = await request.query`INSERT INTO users (name, email, phone) OUTPUT INSERTED.id VALUES (${userData.name}, ${userData.email}, ${userData.phone})`;
                userId = insertUserResult.recordset[0].id; // Get the new user ID
            }

            // Insert the event
            const eventInsertResult = await request.query`INSERT INTO event (user_id, title, type, description, date, tax, total, children) OUTPUT INSERTED.id VALUES (${userId}, ${eventData.title}, ${eventData.type}, ${eventData.description}, ${eventData.date}, ${eventData.tax}, ${eventData.total}, ${eventData.children})`;
            const eventId = eventInsertResult.recordset[0].id; // Get the new event ID

            // Insert products into the product_event table
            for (const vendor of productVendors) {
                // Check if the product exists
                const productResult = await request.query`SELECT id FROM products WHERE vendor = ${vendor}`;

                if (productResult.recordset.length > 0) {
                    const productId = productResult.recordset[0].id;

                    // Insert into product_event
                    await request.query`INSERT INTO product_event (event_id, product_id) VALUES (${eventId}, ${productId})`;
                } else {
                    console.log(`Product with vendor ${vendor} does not exist.`);
                }
            }

            // Commit the transaction
            await transaction.commit();
            console.log('Transaction committed.');
        } catch (err) {
            // Rollback the transaction on error
            await transaction.rollback();
            console.error('Transaction rolled back:', err);
        }
    } catch (err) {
        console.error('Database connection error:', err);
    } finally {
        await sql.close();
    }
}