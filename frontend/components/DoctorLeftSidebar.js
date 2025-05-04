'use client';
import { useState, useEffect } from "react";

export default function DoctorLeftSidebar({ onFilterChange }) {
  const [filters, setFilters] = useState({
    consultOption: [],
    experience: [],
    charges: [],
    language: []
  });

  const [showAllLanguages, setShowAllLanguages] = useState(false);

  const languages = [
    'English', 'Hindi', 'Telugu', 'Tamil', 'Kannada',
    'Malayalam', 'Bengali', 'Marathi', 'Gujarati',
    'Punjabi', 'Odia'
  ];

  // Debounce filter changes to prevent excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange(filters);
    }, 300);
    return () => clearTimeout(timer);
  }, [filters, onFilterChange]);

  const handleFilterChange = (type, value) => {
    setFilters(prev => {
      const currentValues = prev[type];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [type]: newValues };
    });
  };

  const clearAllFilters = () => {
    setFilters({
      consultOption: [],
      experience: [],
      charges: [],
      language: []
    });
    setShowAllLanguages(false);
  };

  const hasActiveFilters = Object.values(filters).some(arr => arr.length > 0);

  return (
    <div className="w-full h-fit bg-white p-4 rounded-lg shadow-sm sticky top-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">Refine By</h3>
        {hasActiveFilters && (
          <button 
            onClick={clearAllFilters}
            className="text-blue-600 text-sm hover:underline focus:outline-none"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Consultation Mode */}
      <div className="mb-6">
        <h4 className="font-medium text-sm mb-2">Consultation Mode</h4>
        <div className="space-y-2">
          {['Hospital', 'Online'].map(mode => (
            <label key={mode} className="flex items-center cursor-pointer space-x-2">
              <input
                type="checkbox"
                checked={filters.consultOption.includes(mode)}
                onChange={() => handleFilterChange('consultOption', mode)}
                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{mode}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div className="mb-6">
        <h4 className="font-medium text-sm mb-2">Experience</h4>
        <div className="space-y-2">
          {['0-5', '6-10', '10+'].map(range => (
            <label key={range} className="flex items-center cursor-pointer space-x-2">
              <input
                type="checkbox"
                checked={filters.experience.includes(range)}
                onChange={() => handleFilterChange('experience', range)}
                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{range} years</span>
            </label>
          ))}
        </div>
      </div>

      {/* Fees Range */}
      <div className="mb-6">
        <h4 className="font-medium text-sm mb-2">Fees Range</h4>
        <div className="space-y-2">
          {['<500', '500-1000', '1000+'].map(range => (
            <label key={range} className="flex items-center cursor-pointer space-x-2">
              <input
                type="checkbox"
                checked={filters.charges.includes(range)}
                onChange={() => handleFilterChange('charges', range)}
                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">₹{range}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Languages */}
      <div className="mb-6">
        <h4 className="font-medium text-sm mb-2">Languages</h4>
        <div className="space-y-2">
          {(showAllLanguages ? languages : languages.slice(0, 3)).map(language => (
            <label key={language} className="flex items-center cursor-pointer space-x-2">
              <input
                type="checkbox"
                checked={filters.language.includes(language)}
                onChange={() => handleFilterChange('language', language)}
                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{language}</span>
            </label>
          ))}
          {languages.length > 3 && (
            <button 
              onClick={() => setShowAllLanguages(!showAllLanguages)}
              className="text-blue-600 text-sm mt-2 hover:underline focus:outline-none"
            >
              {showAllLanguages ? 'Show Less' : `+${languages.length - 3} More`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}