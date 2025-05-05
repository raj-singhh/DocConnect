'use client';
import { useState } from 'react';

export default function Filters({ onFilterChange, onSortChange }) {
  const [filters, setFilters] = useState({
    specialization: '',
    location: ''
  });
  const [sortOption, setSortOption] = useState('');

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortOption(value);
    onSortChange(value);
  };

  const clearFilters = () => {
    setFilters({ specialization: '', location: '' });
    setSortOption('');
    onFilterChange({ specialization: '', location: '' });
    onSortChange('');
  };

  const hasFilters = filters.specialization || filters.location || sortOption;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="flex flex-col gap-4">
        {/* Search Fields Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Specialization Filter */}
          <div>
            <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">
              Specialization
            </label>
            <input
              type="text"
              id="specialization"
              name="specialization"
              value={filters.specialization}
              onChange={handleFilterChange}
              placeholder="Cardiology, Neurology..."
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Location Filter */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="City or Hospital"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Sort and Clear Container */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Sorting Dropdown */}
          <div className="w-full sm:w-48">
            <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              id="sort"
              value={sortOption}
              onChange={handleSortChange}
              className="w-full p-2 border border-gray-300 rounded-md cursor-pointer focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="experience-high">Years of Experience</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              disabled={!hasFilters}
              className={`w-full sm:w-auto h-[42px] px-3 py-2 border rounded-md text-sm flex items-center justify-center ${
                hasFilters
                  ? 'text-blue-600 border-blue-200 hover:bg-blue-50 cursor-pointer'
                  : 'text-gray-400 border-gray-200 cursor-not-allowed'
              }`}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 mr-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                />
              </svg>
              Clear All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}