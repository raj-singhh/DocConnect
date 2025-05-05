const DoctorCard = ({ doctor }) => {
  // Capitalize words like names or locations
  const capitalize = (str) => {
    if (!str) return '';
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Process qualifications (string or array) into clean array
  const processQualifications = (quals) => {
    if (!quals) return [];
    try {
      let processed = [];

      if (Array.isArray(quals)) {
        processed = quals;
      } else if (typeof quals === 'string') {
        if (quals.trim().startsWith('[')) {
          processed = JSON.parse(quals.replace(/'/g, '"'));
        } else {
          processed = quals.split(',');
        }
      }

      return processed
        .map(q => q?.toString().replace(/[•·"\[\]]/g, '').trim().toUpperCase())
        .filter(Boolean);
    } catch (e) {
      console.error('Error processing qualifications:', e);
      return [];
    }
  };

  // Get consult options 
  const getConsultOptions = () => {
    try {
      if (Array.isArray(doctor.consultOption)) {
        const joinedString = doctor.consultOption.join('').replace(/""/g, '"');
        try {
          const parsed = JSON.parse(joinedString);
          if (Array.isArray(parsed)) {
            return parsed.map(opt => String(opt).toLowerCase().trim());
          }
        } catch {
          return doctor.consultOption
            .map(opt => opt.replace(/["\[\]]/g, '').toLowerCase().trim())
            .filter(opt => opt.length > 0);
        }
      }

      if (typeof doctor.consultOption === 'string') {
        return doctor.consultOption
          .replace(/["\[\]]/g, '')
          .split(',')
          .map(opt => opt.toLowerCase().trim());
      }

      return [];
    } catch (error) {
      console.error('Consult options processing error:', error);
      return [];
    }
  };

  const qualifications = processQualifications(doctor.qualifications);
  const consultOptions = getConsultOptions();
  const hasHospital = consultOptions.includes("hospital");
  const hasOnline = consultOptions.includes('online');

  return (
    <div className="w-full flex flex-col lg:flex-row gap-4 p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow mb-4 bg-white">
   
      <div className="flex-shrink-0 mx-auto lg:mx-0">
        <img
          src={`${process.env.NEXT_PUBLIC_API_URL}/${doctor.photoUrl}`}
          alt={`Dr. ${doctor.name}`}
          className="w-20 h-20 rounded-full object-cover border-4 border-blue-100 shadow-sm"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/default-doctor.png';
          }}
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row flex-grow gap-4 w-full">
        <div className="flex-grow space-y-2 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-gray-800 truncate">Dr. {capitalize(doctor.name)}</h2>
              <p className="text-blue-600 font-medium text-sm truncate">{capitalize(doctor.specialization)}</p>
            </div>
            {doctor.experience && (
              <span className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap self-start sm:self-auto">
                {doctor.experience}+ years
              </span>
            )}
          </div>

          {/* Qualifications */}
          {qualifications.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {qualifications.slice(0, 3).map((q, index) => (
                <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                  {q}
                </span>
              ))}
              {qualifications.length > 3 && (
                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                  +{qualifications.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Location and Availability */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
            {doctor.location && (
              <div className="flex items-center max-w-[60%] truncate">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="truncate">{capitalize(doctor.location)}</span>
              </div>
            )}
            <div className="flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Available Today</span>
            </div>
          </div>
        </div>

        {/* Fee and Booking Buttons */}
        <div className="flex flex-col justify-between items-end gap-3 min-w-[140px]">
          {doctor.charges && (
            <div className="text-right">
              <p className="text-gray-500 text-xs">Consultation Fee</p>
              <p className="text-base font-bold text-gray-800">₹{doctor.charges}</p>
            </div>
          )}
          <div className="flex flex-col gap-2 w-full">
  {hasOnline && (
    <button
      onClick={() => alert(`Starting online consultation with Dr. ${doctor.name}`)}
      className="w-full text-blue-600 px-4 py-2 rounded-md transition-colors text-sm font-medium shadow-md border border-blue-600 hover:text-white hover:bg-blue-600"
      aria-label={`Book online consultation with Dr. ${doctor.name}`}
    >
      Consult Online
    </button>
  )}
  {hasHospital && (
    <button
      onClick={() => alert(`Booking hospital appointment with Dr. ${doctor.name}`)}
      className="w-full text-green-600 px-4 py-2 rounded-md transition-colors text-sm font-medium shadow-md border border-green-600 hover:text-white hover:bg-green-600"
      aria-label={`Book hospital appointment with Dr. ${doctor.name}`}
    >
      Visit Hospital
    </button>
  )}
</div>

        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
