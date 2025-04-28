const express = require("express");
const app = express();
const port = 3000; // or any other desired port //setting up DB
const mysql = require("mysql");

app.get("/", (req, res) => {
    res.send("Hello World!");
});


//activating server 
app.listen(port, () => {
    console.log(`Server is running on port ${port}`); });
  