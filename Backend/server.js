const express = require("express");
const bodyParser = require("body-parser");
const sql = require('mssql');
const cors = require('cors');

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

app.post("/insertUserEventProduct", async (req, res) => {
  const { hostInfo, bookingInfo, items } = req.body;

  try {
    const result = await insertUserEventProduct(hostInfo, bookingInfo, items);
    if (result === 1) {
      res.json({ success: true });
    } else {
      res.json({ success: false, message: "Failed to insert data" });
    }
  } catch (error) {
    console.error("Error in /insertUserEventProduct:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/getEventDates", async (req, res) => {
    try {
        const dates = await getEventDates();
        res.json(dates); // Send the array of dates as JSON
    } catch (err) {
        console.error("Error in /getEventDates:", err);
        res.status(500).send("Error retrieving event dates");
    }
});

// Activating server 
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

async function getEventDates() {
    try {
        const result = await sql.query`
            SELECT p.vendor, e.date 
            FROM products p 
            JOIN product_event pe ON p.id = pe.product_id 
            JOIN event e ON e.id = pe.event_id`;
        return result.recordset; // Return an array of objects with vendor and date
    } catch (err) {
        console.error('Error fetching event dates:', err);
        throw err; // Re-throw the error to handle it in the calling function
    }
}

async function insertUserEventProduct(userData, eventData, productVendors) {
    if (userData === null) {
        console.error("User data is null");
        return 0; // Failure
    }

    try {
        console.log("Starting transaction...");
        const transaction = new sql.Transaction();
        await transaction.begin();

        try {
            const request = new sql.Request(transaction);

            console.log("Checking if user exists...");
            // Check if the user already exists
            const userResult = await request.query`
                SELECT id FROM users WHERE email = ${userData.email}`;
            let userId;

            if (userResult.recordset.length > 0) {
                userId = userResult.recordset[0].id;
                console.log(`User exists with ID: ${userId}`);
            } else {
                console.log("User does not exist. Inserting new user...");
                // Clear previous parameters if needed
                request.input('name', sql.VarChar, userData.fname+' '+ userData.lname);
                request.input('email', sql.VarChar, userData.email);
                request.input('phone', sql.VarChar, userData.code+''+userData.contact);

                const insertUserResult = await request.query`
                    INSERT INTO users (name, email, phone) 
                    OUTPUT INSERTED.id 
                    VALUES (@name, @email, @phone)`;
                userId = insertUserResult.recordset[0].id;
                console.log(`New user inserted with ID: ${userId}`);
            }

            console.log("Inserting event...");
            // Clear previous parameters
            request.input('userId', sql.Int, userId);
            request.input('title', sql.VarChar, eventData.eventTitle);
            request.input('type', sql.VarChar, eventData.eventType);
            request.input('description', sql.VarChar, eventData.eventDescription);
            request.input('date', sql.DateTime, productVendors[0].date);
            request.input('tax', sql.Decimal, eventData.tax);
            request.input('total', sql.Decimal, eventData.total);
            request.input('children', sql.Bit, eventData.children?0:1 );


            const eventInsertResult = await request.query`
                INSERT INTO event (user_id, title, type, description, date, tax, total, children) 
                OUTPUT INSERTED.id 
                VALUES (@userId, @title, @type, @description, @date, @tax, @total, @children)`;
            const eventId = eventInsertResult.recordset[0].id;
            console.log(`Event inserted with ID: ${eventId}`);

            console.log("Inserting products into product_event...");
            for (const vendor of productVendors) {
                if (!vendor.id) {
                    console.error("Vendor ID is missing");
                    continue; // Skip this vendor if id is not present
                }

                // Clear previous parameters
                request.parameters = {};

                request.input('eventId', sql.Int, eventId);
                request.input('productId', sql.Int, vendor.id);

                console.log(`Inserting product with ID: ${vendor.id} for event ID: ${eventId}`);
                await request.query`
                    INSERT INTO product_event (event_id, product_id) 
                    VALUES (@eventId,@productId)`; 
            }

            await transaction.commit();
            console.log('Transaction committed successfully.');
            return 1; // Success
        } catch (err) {
            await transaction.rollback();
            console.error('Transaction rolled back:', err);
            return 0; // Failure
        }
    } catch (err) {
        console.error('Database connection error:', err);
        return 0; // Failure
    } 
}

  app.post("/userBookings", async (req, res) => {
    const { email, contact } = req.body;

    if (!email || !contact) {
        return res.status(400).json({ 
            success: false, 
            message: "Email and contact are required" 
        });
    }

    try {
        const request = new sql.Request();
        
        // Search for the user by email and phone suffix
        const userQuery = await request.query`
            SELECT id FROM users 
            WHERE email = ${email} 
            AND phone LIKE '%${contact}'`;

        if (userQuery.recordset.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        const userId = userQuery.recordset[0].id;

        // Fetch the user's most recent booking
        const bookingsQuery = await request.query`
            SELECT TOP 1 
                e.id, e.title, e.type, e.description, 
                e.date, e.tax, e.total, e.children
            FROM event e
            WHERE e.user_id = ${userId}
            ORDER BY e.date DESC`;

        if (bookingsQuery.recordset.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "No bookings found" 
            });
        }

        const booking = bookingsQuery.recordset[0];

        // Fetch products associated with this booking
        const productsQuery = await request.query`
            SELECT p.id, p.name, p.vendor, p.price
            FROM product_event pe
            JOIN products p ON pe.product_id = p.id
            WHERE pe.event_id = ${booking.id}`;

        res.json({ 
            success: true,
            bookings: [{
                ...booking,
                products: productsQuery.recordset
            }]
        });

    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ 
            success: false, 
            message: "Server error" 
        });
    }
});
async function sendConfirmation(data) {
    try {
      const response = await fetch("/api/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error(`Response status: ${response.status}`);
      const result = await response.json();
      console.log("Response from server:", result);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }