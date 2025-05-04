const express = require('express');
const router = express.Router();
const { addDoctor, listDoctors, upload } = require('../controllers/doctorController'); // Import controller functions

// Route to add a doctor with file upload
router.post('/add-doctor', upload.single('photo'), addDoctor); // Use 'upload.single' for file upload

// Route to list doctors with filters and pagination
router.get('/list-doctors', listDoctors);

module.exports = router;
