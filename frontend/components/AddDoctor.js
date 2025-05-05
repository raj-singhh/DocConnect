'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';

export default function AddDoctor({ onDoctorAdded, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    qualifications: '',
    experience: '',
    location: '',
    charges: '',
    photo: null,
    consultModes: [],
    languages: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const consultModeOptions = ['Hospital', 'Online'];
  const languageOptions = ['English', 'Hindi', 'Marathi', 'Bengali', 'Tamil', 'Telugu','Gujarati',
    'Punjabi', 'Odia','Malayalam'];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleMultiSelect = (name, value, isChecked) => {
    setFormData(prev => ({
      ...prev,
      [name]: isChecked
        ? [...prev[name], value]
        : prev[name].filter(item => item !== value)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.specialization.trim()) newErrors.specialization = 'Specialization is required';
    if (!formData.qualifications.trim()) newErrors.qualifications = 'Qualifications are required';
    if (!formData.experience) newErrors.experience = 'Experience is required';
    if (formData.experience < 0) newErrors.experience = 'Experience cannot be negative';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.charges) newErrors.charges = 'Charges are required';
    if (formData.charges < 0) newErrors.charges = 'Charges cannot be negative';
    if (!formData.photo) newErrors.photo = 'Photo is required';
    if (formData.consultModes.length === 0) newErrors.consultModes = 'At least one consult mode is required';
    if (formData.languages.length === 0) newErrors.languages = 'At least one language is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fill all required details');
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      const formPayload = new FormData();
      formPayload.append('name', formData.name.trim());
      formPayload.append('specialization', formData.specialization.trim());
      formPayload.append('qualifications', formData.qualifications); // Don't stringify here
      formPayload.append('experience', formData.experience);
      formPayload.append('location', formData.location.trim());
      formPayload.append('charges', formData.charges);
      formPayload.append('consultOption', JSON.stringify(formData.consultModes));
      formPayload.append('language', JSON.stringify(formData.languages));
      if (formData.photo) formPayload.append('photo', formData.photo);

       // Add this console.log right before the fetch call
    
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/doctors/add-doctor`, {
        method: 'POST',
        body: formPayload, // Let browser set Content-Type with boundary
      });
  
      const responseText = await res.text();
      let data;
      
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        console.error('Failed to parse JSON:', responseText);
        throw new Error('Invalid server response');
      }
  
      if (!res.ok) {
        console.error('Error response:', data);
        throw new Error(data.message || `Server error: ${res.status}`);
      }
  
      toast.success('Doctor added successfully!');
      onDoctorAdded(data.doctor);
      onCancel();
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(error.message || 'Error adding doctor');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
      <div className="flex justify-between items-start">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Add New Doctor
        </h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-500 focus:outline-none cursor-pointer"
          disabled={isSubmitting}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="mt-4">
        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter doctor's full name"
              className={`w-full p-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* Specialization Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Specialization *</label>
            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              placeholder="e.g. Cardiologist, Dentist, etc."
              className={`w-full p-2 border rounded-md ${errors.specialization ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.specialization && <p className="mt-1 text-sm text-red-600">{errors.specialization}</p>}
          </div>

          {/* Qualifications Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Qualifications (comma separated) *</label>
            <input
              type="text"
              name="qualifications"
              value={formData.qualifications}
              onChange={handleChange}
              placeholder="e.g. MBBS, MD, PhD"
              className={`w-full p-2 border rounded-md ${errors.qualifications ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.qualifications && <p className="mt-1 text-sm text-red-600">{errors.qualifications}</p>}
          </div>

          {/* Experience and Charges */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Experience (years) *</label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                min="0"
                placeholder="Years of experience"
                className={`w-full p-2 border rounded-md ${errors.experience ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.experience && <p className="mt-1 text-sm text-red-600">{errors.experience}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Charges (₹) *</label>
              <input
                type="number"
                name="charges"
                value={formData.charges}
                onChange={handleChange}
                min="0"
                placeholder="Consultation fee"
                className={`w-full p-2 border rounded-md ${errors.charges ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.charges && <p className="mt-1 text-sm text-red-600">{errors.charges}</p>}
            </div>
          </div>

          {/* Location Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Clinic or hospital address"
              className={`w-full p-2 border rounded-md ${errors.location ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
          </div>

          {/* Consult Mode Options */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Modes *</label>
            <div className="space-y-2">
              {consultModeOptions.map(mode => (
                <div key={mode} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`mode-${mode}`}
                    checked={formData.consultModes.includes(mode)}
                    onChange={(e) => handleMultiSelect('consultModes', mode, e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor={`mode-${mode}`} className="ml-2 text-sm text-gray-700">
                    {mode}
                  </label>
                </div>
              ))}
            </div>
            {errors.consultModes && <p className="mt-1 text-sm text-red-600">{errors.consultModes}</p>}
          </div>

          {/* Language Options */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Languages Spoken *</label>
            <div className="grid grid-cols-2 gap-2">
              {languageOptions.map(lang => (
                <div key={lang} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`lang-${lang}`}
                    checked={formData.languages.includes(lang)}
                    onChange={(e) => handleMultiSelect('languages', lang, e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor={`lang-${lang}`} className="ml-2 text-sm text-gray-700">
                    {lang}
                  </label>
                </div>
              ))}
            </div>
            {errors.languages && <p className="mt-1 text-sm text-red-600">{errors.languages}</p>}
          </div>

          {/* Photo Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Photo *</label>
            <label className={`flex items-center justify-between w-full p-2 border rounded-md cursor-pointer ${errors.photo ? 'border-red-500' : 'border-gray-300 hover:border-blue-500'} transition-colors`}>
              <span className="text-gray-500 truncate">
                {formData.photo ? formData.photo.name : "No file chosen"}
              </span>
              <span className="ml-2 px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200 cursor-pointer">
                Choose File
              </span>
              <input
                type="file"
                name="photo"
                onChange={handleChange}
                accept="image/*"
                className="hidden"
              />
            </label>
            {errors.photo && <p className="mt-1 text-sm text-red-600">{errors.photo}</p>}
          </div>

          {/* Form Actions */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="cursor-pointer px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Adding...' : 'Add Doctor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}