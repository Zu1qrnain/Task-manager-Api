require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const taskRoutes = require('./src/routes/taskRoutes');
const authRoutes = require('./src/routes/authRoutes');
const { authenticateUser } = require('./src/middleware/authMiddleware');


const app = express();


app.use(express.json());


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log(" Connected to MongoDB"))
    .catch(err => console.error(" MongoDB connection error:", err));


// Authentication routes (e.g., login, register)
app.use('/api/auth', authRoutes);


app.use('/api/tasks', authenticateUser, taskRoutes);



app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));

