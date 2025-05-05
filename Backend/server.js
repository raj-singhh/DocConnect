const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path'); 
const multer = require('multer'); // For file uploads
const doctorRoutes = require('./routes/doctorRoutes'); 

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin:  'https://docconnect-five.vercel.app/',
  methods: ["GET", "POST", "PUT", "DELETE"],
 
})); 
app.use(express.json()); // Parse incoming JSON requests

// Setup Multer storage engine for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Uploads folder where the file will be stored
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // File name format
  }
});

// Create Multer upload instance
const upload = multer({ storage: storage });

// API routes
app.use('/api/doctors', doctorRoutes); // Add doctors API routes under '/api/doctors'

// Serve static files (images) from the 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const PORT= process.env.PORT || 5000; // Default to 5000 if PORT is not set in .env
// Connect to MongoDB and start the server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1); // Exit the process if MongoDB connection fails
  });

module.exports = { upload };
