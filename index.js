const express = require("express");
const cors = require('cors');
const sequelize = require('./config/database');
const postRoutes = require('./routes/posts-routes');

const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

app.use('/api/posts', postRoutes);

app.listen(3001, () => {
    console.log("Server running on port 3001");
});

sequelize.sync()
    .then(() => {
        console.log('Database & tables created');
    });