const express = require('express');
require('dotenv').config();
const connectDB = require('./db')

const app = express()

app.use(express.json({ extended: false }));
// database connection
connectDB();
// routes

app.use('/api/v1/user/', require('./routes/user'));
app.use('/api/v1/auth/', require('./routes/auth'));
app.use('/api/v1/teacher/', require('./routes/teacher'));


// PORT 
const PORT = process.env.PORT || 8080; // or any other available port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
