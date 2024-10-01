import React from 'react';

const RecordedSession: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Recorded Sessions</h2>

        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-sm">
          {/* Video Thumbnail */}
          <div className="flex-shrink-0">
            <div className="relative">
              <img
                src="https://via.placeholder.com/150" // Replace with actual thumbnail
                alt="Session thumbnail"
                className="w-40 h-24 rounded-lg object-cover"
              />
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="bg-white text-gray-900 rounded-full p-2 focus:outline-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.752 11.168l-6.96-4.02A1 1 0 006 8.08v7.84a1 1 0 001.793.81l6.96-4.02a1 1 0 000-1.72z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Session Info */}
          <div className="ml-6 flex-grow">
            <p className="text-lg font-semibold">
              Date: <span className="text-gray-700">September 13, 2024</span>
            </p>
            <p className="text-lg font-semibold">
              Time: <span className="text-gray-700">3:40 PM</span>
            </p>
            <p className="text-lg font-semibold">
              Client: <span className="text-gray-700">Denzel White</span>
            </p>
          </div>

          {/* Delete Button */}
          <div className="flex-shrink-0">
            <button className="bg-red-500 text-white p-3 rounded-full shadow-md hover:bg-red-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordedSession;
