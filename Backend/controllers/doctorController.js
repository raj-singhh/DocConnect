const multer = require('multer');
const path = require('path');
const Doctor = require('../models/Doctor');

// Multer configuration remains the same
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

const capitalizeEachWord = (text) =>
  text
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

// Helper function to clean and format qualifications
const formatQualifications = (quals) => {
  if (!quals) return [];
  
  // Handle both string and array inputs
  const qualificationsArray = typeof quals === 'string' 
    ? quals.split(',').map(q => q.trim())
    : Array.isArray(quals) 
      ? quals 
      : [];

  return qualificationsArray
    .map(q => {
      // Remove any existing bullets, brackets, or quotes
      const cleaned = q.toString()
        .replace(/[•·"\[\]]/g, '')
        .trim()
        .toUpperCase();
      return cleaned;
    })
    .filter(q => q.length > 0);
};

// Helper function to format array fields (for language and consultOption)
const formatArrayField = (field) => {
  if (!field) return [];

  // Already an array
  if (Array.isArray(field)) return field;

  // If it's a string, try parsing it
  if (typeof field === 'string') {
    try {
      const parsed = JSON.parse(field);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return [field];
    }
  }

  return [field]; // fallback
};


// Add Doctor - Updated with language and consultOption
const addDoctor = async (req, res) => {
  try {
    let { name, specialization, experience, location, charges, qualifications, language, consultOption } = req.body;
    const photo = req.file;

    if (!name || !specialization || !experience || !location || !charges || !photo || !qualifications) {
      return res.status(400).json({ message: 'Please provide all required fields including photo' });
    }

    // Normalize inputs
    name = capitalizeEachWord(name.trim());
    specialization = specialization.trim().toLowerCase();
    location = location.trim().toLowerCase();
    
    experience = parseInt(experience);
    charges = parseInt(charges);
    // Clean and format qualifications
    qualifications = formatQualifications(qualifications);
    
    // Format language and consultOption
    language = formatArrayField(language);
    consultOption = formatArrayField(consultOption);

    const newDoctor = new Doctor({
      name,
      specialization,
      experience,
      location,
      charges,
      photoUrl: photo.path,
      qualifications,
      language,
      consultOption
    });

    await newDoctor.save();

    res.status(201).json({
      message: 'Doctor added successfully',
      doctor: {
        ...newDoctor.toObject(),
        name: capitalizeEachWord(newDoctor.name),
        specialization: capitalizeEachWord(newDoctor.specialization),
        location: capitalizeEachWord(newDoctor.location),
      },
    });
  } catch (error) {
    console.error('Error adding doctor:', error);
    res.status(500).json({ message: 'Failed to add doctor', error: error.message });
  }
};

// List Doctors - Updated to include new fields
const listDoctors = async (req, res) => {
  try {
    const {
      specialization,
      location,
      page = 1,
      limit = 10,
      sort,
      consultOption,
      experience,
      charges,
      language
    } = req.query;

    const filters = [];

    // Text search filters
    if (specialization) {
      filters.push({ specialization: { $regex: specialization, $options: 'i' } });
    }

    if (location) {
      filters.push({ location: { $regex: location, $options: 'i' } });
    }

    // Array filters
    if (consultOption) {
      const consultOptions = typeof consultOption === 'string' 
        ? consultOption.split(',') 
        : Array.isArray(consultOption) 
          ? consultOption 
          : [consultOption];
      
      filters.push({ 
        consultOption: { 
          $in: consultOptions.map(opt => new RegExp(opt.trim(), 'i') )
        } 
      });
    }
    
    if (language) {
      const languages = typeof language === 'string' 
        ? language.split(',') 
        : Array.isArray(language) 
          ? language 
          : [language];
      
      filters.push({ 
        language: { 
          $in: languages.map(lang => new RegExp(lang.trim(), 'i')) 
        } 
      });
    }

    // Experience filter
    if (experience) {
      const expConditions = [];
      const expRanges = Array.isArray(experience) ? experience : [experience];
      expRanges.forEach(range => {
        switch (range) {
          case '0-5': expConditions.push({ experience: { $gte: 0, $lte: 5 } }); break;
          case '6-10': expConditions.push({ experience: { $gte: 6, $lte: 10 } }); break;
          case '10+': expConditions.push({ experience: { $gte: 11 } }); break;
        }
      });
      if (expConditions.length > 0) {
        filters.push({ $or: expConditions });
      }
    }

    // Charges filter
    if (charges) {
      const chargeConditions = [];
      const chargeRanges = Array.isArray(charges) ? charges : [charges];
      chargeRanges.forEach(range => {
        switch (range) {
          case '<500': chargeConditions.push({ charges: { $lte: 500 } }); break;
          case '500-1000': chargeConditions.push({ charges: { $gte: 501, $lte: 1000 } }); break;
          case '1000+': chargeConditions.push({ charges: { $gte: 1001 } }); break;
        }
      });
      if (chargeConditions.length > 0) {
        filters.push({ $or: chargeConditions });
      }
    }

    // Combine all filters using $and
    const mongoFilter = filters.length > 0 ? { $and: filters } : {};

    // Sorting
    let sortCriteria = {};
    switch (sort) {
      case 'price-low': sortCriteria = { charges: 1 }; break;
      case 'price-high': sortCriteria = { charges: -1 }; break;
      case 'experience-low': sortCriteria = { experience: 1 }; break;
      case 'experience-high': sortCriteria = { experience: -1 }; break;
    }

    const doctors = await Doctor.find(mongoFilter)
      .sort(sortCriteria)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalDoctors = await Doctor.countDocuments(mongoFilter);

    res.json({
      doctors: doctors.map(doctor => ({
        ...doctor.toObject(),
        name: capitalizeEachWord(doctor.name),
        specialization: capitalizeEachWord(doctor.specialization),
        location: capitalizeEachWord(doctor.location)
      })),
      totalDoctors,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalDoctors / limit),
    });

  } catch (error) {
    console.error('Error listing doctors:', error);
    res.status(500).json({
      message: 'Failed to retrieve doctors',
      error: error.message
    });
  }
};


module.exports = { addDoctor, listDoctors, upload };