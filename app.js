const express = require('express');
require('dotenv').config();
const connectDB = require('./db')

const app = express()

// database connection
connectDB();
// routes

app.get('/', function(req, res) {
    res.send("Hello World!");
});

// PORT 
const PORT = process.env.PORT || 8080; // or any other available port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
