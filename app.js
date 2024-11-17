const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const applicantRoutes = require('./routes/applicantRoutes');
const employerRoutes = require('./routes/employerRoutes');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/applicants', applicantRoutes);
app.use('/api/employers', employerRoutes);

/*
mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));*/

  // MongoDB Connection
const connectDatabases = async () => {
    try {
        // Internal Database Connection
        const internalDB = await mongoose.createConnection(process.env.INTERNAL_DB_URI);
        console.log('Internal MongoDB connected');

        // External Database Connection (MongoDB Atlas)
        const externalDB = await mongoose.createConnection(process.env.EXTERNAL_DB_URI);
        console.log('External MongoDB (Atlas) connected');

        // Example: Making connections available to routes
        app.locals.internalDB = internalDB;
        app.locals.externalDB = externalDB;
    } catch (err) {
        console.error('Error connecting to databases:', err);
    }
};

connectDatabases();

// File Upload Configuration (Multer)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// Sample Route
app.get('/', (req, res) => {
    res.send('Job Portal API');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
