require('dotenv').config();

const express = require("express");
const app = express();
const cors = require('cors');  

app.use(cors({ origin: 'https://twixer-client-7fc12e0d4cd5.herokuapp.com/', credentials: true }));
app.use(express.json());

// Load models
const db = require('./models');

// Routes
const userRouter = require('./routes/Users');
app.use("/api/users", userRouter);

const followRouter = require('./routes/Follows');
app.use("/api/follows", followRouter);

const likeRouter = require('./routes/Likes');
app.use("/api/likes", likeRouter);

const uploadRouter = require('./routes/Uploads');
app.use("/api/uploads", uploadRouter);

const postRouter = require('./routes/Posts');
app.use("/api/posts", postRouter);

const replyRouter = require('./routes/Replies');
app.use("/api/replies", replyRouter);

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