const express = require('express');
require('dotenv').config();
const connectDB = require('./db');
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerJsDocs = YAML.load('./api.yaml')

const app = express();

app.use(express.json({ extended: false }));

// Database connection
connectDB();

// Routes
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const teacherRoutes = require('./routes/teacher');

app.use('/api/v1/user/', userRoutes);
app.use('/api/v1/auth/', authRoutes);
app.use('/api/v1/teacher/',teacherRoutes);


app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerJsDocs))
app.post('/',(req,res)=>{
  res.send('UP & RUNNING')
})
// PORT 
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
