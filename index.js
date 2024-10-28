require('dotenv').config();

const express = require("express");
const app = express();

const cors = require('cors');  
app.use(cors());  
app.use(express.json());

// Initialize Sequelize with environment variables
// const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize(
//   process.env.DB_DATABASE,
//   process.env.DB_USERNAME,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     dialect: 'mysql',
//     dialectOptions: {
//       ssl: {
//         require: true,
//         rejectUnauthorized: false
//       }
//     }
//   }
// );

// Load models
const db = require('./models');

// Routes
//const userRouter = require('./routes/Users');
//app.use("/api/users", userRouter);

//const followRouter = require('./routes/Follows');
//app.use("/api/follows", followRouter);

//const likeRouter = require('./routes/Likes');
//app.use("/api/likes", likeRouter);


// Start the server
const PORT = process.env.PORT;  
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Test the connection
db.sequelize.sync()
  .then(() => {
    console.log('Database connection and sync established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });