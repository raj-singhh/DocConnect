const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  qualifications: [String],
  experience: { type: Number, required: true },
  location: { type: String, required: true },
  charges: { type: Number, required: true },
  photoUrl: { type: String, required: true },
  language: { type: [String], default: [] },          // Added this line
  consultOption: { type: [String], default: [] }     // Added this line
});

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;