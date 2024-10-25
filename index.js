require('dotenv').config();

const express = require("express");
const app = express();

const cors = require('cors');  
app.use(cors());  
app.use(express.json());

// Initialize Sequelize with environment variables
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
);

// Load models
//const db = require('./models'); 

// Routes
//const userRouter = require('./routes/Users');
//app.use("/api/users", userRouter);

// Start the server
const PORT = process.env.PORT;  
app.listen(PORT, () => {
  console.log("Server running on port 13106");
});

// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connection established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });