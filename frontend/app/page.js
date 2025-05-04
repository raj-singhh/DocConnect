'use client';

import { useEffect, useState } from 'react';
import { debounce } from 'lodash';
import Header from '@/components/Header';
import Filters from '@/components/Filters';
import DoctorCard from '@/components/DoctorCard';
import AddDoctor from '@/components/AddDoctor';
import DoctorLeftSidebar from '@/components/DoctorLeftSidebar';
import DoctorRightSidebar from '@/components/DoctorRightSidebar';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function DestinationPage() {
  const [doctors, setDoctors] = useState([]);
  const [filters, setFilters] = useState({
    specialization: '',
    location: ''
  });
  const [sidebarFilters, setSidebarFilters] = useState({});
  const [sortOption, setSortOption] = useState('');
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const fetchDoctors = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ 
        ...filters,
        ...sidebarFilters,
        sort: sortOption,
        page, 
        limit: 5 
      }).toString();
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      const res = await fetch(`${backendUrl}/api/doctors/list-doctors?${params}`);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      setDoctors(data.doctors);
      setTotalPages(data.totalPages);
      
      if (isFirstLoad) {
        setIsFirstLoad(false);
      }
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch doctors');
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedFetchDoctors = debounce(fetchDoctors, 300);

  useEffect(() => {
    debouncedFetchDoctors();
    return () => debouncedFetchDoctors.cancel();
  }, [filters, sidebarFilters, page, sortOption]);

  const handleAddDoctor = async (newDoctor) => {
    try {
      setDoctors(prev => [newDoctor, ...prev]);
      setShowAddDoctor(false);
      await fetchDoctors();
    } catch (err) {
      toast.error('Failed to add doctor');
      console.error('Add doctor error:', err);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.getElementById('mobile-sidebar');
      const toggleButton = document.getElementById('mobile-sidebar-toggle');
      
      if (sidebar && toggleButton && 
          !sidebar.contains(event.target) && 
          !toggleButton.contains(event.target)) {
        setMobileSidebarOpen(false);
      }
    };

    if (mobileSidebarOpen || showAddDoctor) {
      document.body.style.overflow = 'hidden';
      if (mobileSidebarOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileSidebarOpen, showAddDoctor]);

  const showEmptyState = !isLoading && doctors.length === 0;
  const showFirstDoctorMessage = showEmptyState && isFirstLoad && 
                                Object.keys(filters).length === 0 && 
                                Object.keys(sidebarFilters).length === 0;

  return (
    <main className=" min-h-screen bg-gray-50 overflow-x-hidden">
       <div className="fixed top-0 left-0 right-0 z-50 ">
        <Header />
      </div>
      
      {/* Mobile Sidebar Toggle */}
      <button 
        id="mobile-sidebar-toggle"
        onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        className={`md:hidden fixed bottom-6 right-6 z-30 w-14 h-14 flex items-center justify-center rounded-full shadow-lg transition-all duration-300 ${
          mobileSidebarOpen ? 'bg-red-500 rotate-90' : 'bg-blue-600'
        }`}
        aria-label="Toggle filters"
      >
        {mobileSidebarOpen ? (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        )}
      </button>

      {/* Mobile Sidebar */}
      {mobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-20  bg-opacity-50 transition-opacity duration-300">
          <div 
            id="mobile-sidebar"
            className="absolute left-0 top-0 h-full w-4/5 max-w-xs bg-white shadow-xl"
            style={{
              transform: mobileSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
              transition: 'transform 0.3s ease-out'
            }}
          >
            <div className="p-4 h-full overflow-y-auto">
              <div className="flex items-center justify-between mb-6 border-b pb-4">
                <h2 className="text-xl font-bold text-gray-800">Filters</h2>
                <button 
                  onClick={() => setMobileSidebarOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <DoctorLeftSidebar onFilterChange={setSidebarFilters} />
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-6 mt-12">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Sidebar - Desktop */}
          <div className="hidden md:block w-full md:w-1/5 sticky top-4 self-start">
            <DoctorLeftSidebar onFilterChange={setSidebarFilters} />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-h-[calc(100vh-200px)]">
            <div className="sticky top-0 z-10 bg-gray-50 py-4 -mx-4 px-4">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-800">Find Doctors</h1>
                <button
                  onClick={() => setShowAddDoctor(true)}
                  className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  + Add Doctor
                </button>
              </div>

              <Filters 
                onFilterChange={setFilters} 
                onSortChange={setSortOption} 
              />
            </div>

            {/* Doctors List */}
            <div className="space-y-4 min-h-[400px]">
              {isLoading ? (
                <div className="space-y-4 min-h-[400px]">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-full h-32 bg-gray-100 rounded-lg animate-pulse"></div>
                  ))}
                </div>
              ) : error ? (
                <div className="p-4 bg-red-100 text-red-700 rounded-md min-h-[100px]">
                  Error: {error}. Please try again.
                </div>
              ) : showEmptyState ? (
                <div className="text-center py-12 min-h-[400px] flex flex-col items-center justify-center">
                  {showFirstDoctorMessage ? (
                    <div className="max-w-md mx-auto">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <h3 className="mt-2 text-lg font-medium text-gray-900">No doctors yet</h3>
                      <p className="mt-1 text-gray-500">Be the first to add a doctor to the system</p>
                      <div className="mt-6">
                        <button
                          onClick={() => setShowAddDoctor(true)}
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                          Add First Doctor
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="mt-2 text-lg font-medium text-gray-900">No doctors found</h3>
                      <p className="mt-1 text-gray-500">We couldn&apos;t find any doctors matching your criteria</p>
                      <div className="mt-6">
                        <button
                          onClick={() => {
                            setFilters({});
                            setSidebarFilters({});
                            setPage(1);
                          }}
                          className="px-4 py-2 text-blue-600 hover:text-blue-800"
                        >
                          Clear filters
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {doctors.map((doc) => (
                    <DoctorCard key={doc._id} doctor={doc} />
                  ))}
                </div>
              )}
            </div>

            {/* Pagination */}
            {doctors.length > 0 && !isLoading && (
              <div className="sticky bottom-0 bg-white py-4 border-t -mx-4 px-4">
                <div className="flex justify-center gap-4 items-center">
                  <button
                    disabled={page <= 1}
                    onClick={() => handlePageChange(page - 1)}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <div className="flex gap-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = page <= 3 
                        ? i + 1 
                        : page >= totalPages - 2 
                          ? totalPages - 4 + i 
                          : page - 2 + i;
                      if (pageNum < 1 || pageNum > totalPages) return null;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-10 h-10 rounded-md ${
                            page === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'bg-white border border-gray-300 hover:bg-gray-100'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => handlePageChange(page + 1)}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar - Desktop */}
          <div className="hidden md:block w-full md:w-1/5 sticky top-4 self-start">
            <DoctorRightSidebar />
          </div>
        </div>
      </div>

      {/* Add Doctor Modal */}
      {showAddDoctor && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <AddDoctor 
                onDoctorAdded={handleAddDoctor} 
                onCancel={() => setShowAddDoctor(false)} 
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}