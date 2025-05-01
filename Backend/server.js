const express = require("express");
const bodyParser = require("body-parser");
const sql = require('mssql');
const cors = require('cors');

const app = express();
const port = 3000; // or any other desired port
const corsOptions = {
    origin: 'http://localhost:5500', 
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
};

app.use(cors(corsOptions));


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

  const validationMessages = validateUserAndBooking(hostInfo, bookingInfo);

if (validationMessages.length > 0) {
  console.error("Validation failed:", validationMessages);
  return res.status(400).json({
    success: false,
    message: "Validation failed"
  });
}

  
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

app.post("/getUserBookings", async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ 
            success: false, 
            message: "Email is required" 
        });
    }

    try {
        const request = new sql.Request();
        const query = `
            SELECT u.id AS User_id, u.name AS User_name, 
                   e.id AS Event_id, e.title AS Event_title, 
                   e.date AS Event_Date ,e.title , e.type , e.description , e.children ,e.tax, e.total
            FROM event e
            JOIN users u ON u.id = e.user_id
            WHERE u.email = @Email`;

        request.input('Email', sql.VarChar, email);
        const result = await request.query(query);

        if (result.recordset.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "No bookings found for the provided email" 
            });
        }

        res.json({ success: true, bookings: result.recordset });
    } catch (err) {
        console.error("Error in /getUserBookings:", err);
        res.status(500).json({ 
            success: false, 
            message: "Server error" 
        });
    }
});

app.post('/submit-review', async (req, res) => {
    const { rating, reviewText, features, recommendation, event_id } = req.body;

    // check if the data is valid
    if (!rating || !recommendation) {
        return res.status(400).json({
            success: false,
            message: "Rating and recommendation are required"
        });
    }

    try {
        const request = new sql.Request();
        const query = `
            INSERT INTO reviews 
            (Rating, ReviewText, LikedFeatures, WouldRecommend, event_id)
            VALUES 
                (@rating, @reviewText, @features, @recommendation, @event_id)
        `;

        // insert the dadta
        request.input('rating', sql.Int, rating);
        request.input('reviewText', sql.NVarChar, reviewText || null);
        request.input('features', sql.NVarChar, features ? features.join(',') : null);
        request.input('recommendation', sql.VarChar(10), recommendation);
         request.input('event_id', sql.Int, event_id);

        await request.query(query);
        
        res.status(201).json({
            success: true,
            message: 'Review submitted successfully'
        });

    } catch (error) {
        console.error('Database Error:', error);
        res.status(500).json({
            success: false,
            message: 'Database error occurred'
        });
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
                request.input('DOB', sql.Date, userData.dob);


                const insertUserResult = await request.query`
                    INSERT INTO users (name, email, phone, DOB) 
                    OUTPUT INSERTED.id 
                    VALUES (@name, @email, @phone, @DOB)`;
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
            request.input('children', sql.Bit, eventData.noChildren === false? 1 : 0);
            
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
  
function validateUserAndBooking(host, booking) {
  const messages = [];

  validateField(host.title, "Title is not selected", isNotDefault("Title"), messages);
  validateField(host.fname, "First name is missing", isNotEmpty, messages);
  validateField(host.lname, "Last name is missing", isNotEmpty, messages);
  //validateField(host.DOB, "Date of birth is missing", isNotEmpty, messages);
  validateField(host.code, "Country code is not selected", isNotDefault("Country Code"), messages);
  validateField(host.contact, "Contact number is missing", isNotEmpty, messages);
  validateField(host.contact, "Contact number must be a 9-digit number", isMobile, messages);
  validateField(host.email, "Email is missing", isNotEmpty, messages);
  validateField(host.email, "Email format is wrong", isEmail, messages);
  //validateField(host.DOB, "Please note: Event planning is restricted to individuals 18 years or older", isEligible18, messages);
  validateField(booking.eventTitle, "Event Title is missing", isNotEmpty, messages);
  validateField(booking.eventType, "Please select an Event Type", isNotDefault("Select Event Type"), messages);
  validateField(booking.eventDescription, "Event Description is missing", isNotEmpty, messages);

  return messages;
}

function validateField(value, message, validator, messages) {
    if (!validator(value)) {
      messages.push(message);
    }
  }
  
  function isNotEmpty(value) {
    return value && value.trim() !== "";
  }
  
  function isEmail(value) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(value.trim());
  }
  
  function isMobile(value) {
    const regex = /^[0-9]{9}$/;
    return regex.test(value.trim());
  }
  
  function isNotDefault(defaultText) {
    return (value) => value && value.trim() !== "" && value !== defaultText;
  }
  
//   function isEligible18(dateStr) {
//     const birthDay = new Date(dateStr);
//     const today = new Date();
//     let age = today.getFullYear() - birthDay.getFullYear();
//     const m = today.getMonth() - birthDay.getMonth();
//     if (m < 0 || (m === 0 && today.getDate() < birthDay.getDate())) {
//       age--;
//     }
//     return age >= 18;
//   }