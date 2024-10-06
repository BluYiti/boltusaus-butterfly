import React from 'react';

const SessionCard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg p-6 md:flex">
        {/* Back Button */}
        <div className="flex justify-start md:w-1/12">
          <button className="bg-black text-white rounded-full w-10 h-10 flex justify-center items-center">
            &#8592;
          </button>
        </div>

        {/* Session Information */}
        <div className="md:w-5/12 bg-blue-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Denzel White’s Session</h2>
          <div className="space-y-3">
            <div>
              <span className="block text-gray-600">Client Name</span>
              <span className="block text-black font-semibold">Denzel White</span>
            </div>
            <div>
              <span className="block text-gray-600">Session Date</span>
              <span className="block text-black font-semibold">April 25, 2024</span>
            </div>
            <div>
              <span className="block text-gray-600">Psychotherapist</span>
              <span className="block text-black font-semibold">Ms. Hanni Pham</span>
            </div>
          </div>

          {/* Icons */}
          <div className="mt-4 flex space-x-2">
            <div className="bg-white p-2 rounded-lg shadow-md">
              <img src="/icons/journals.svg" alt="Journals" className="w-10 h-10" />
            </div>
            <div className="bg-white p-2 rounded-lg shadow-md">
              <img src="/icons/moods.svg" alt="Moods" className="w-10 h-10" />
            </div>
            <div className="bg-white p-2 rounded-lg shadow-md">
              <img src="/icons/goals.svg" alt="Goals" className="w-10 h-10" />
            </div>
          </div>
        </div>

        {/* Private Notes */}
        <div className="md:w-7/12 bg-gray-200 p-6 rounded-lg ml-4">
          <h3 className="text-lg font-semibold mb-2">Private Notes</h3>
          <p className="text-gray-700">
            Today's session with Denzel White was marked by notable progress and positive engagement. He demonstrated a commendable commitment to his therapeutic journey, actively participating in self-reflection and exploring coping strategies. His receptiveness to feedback and openness to new perspectives indicate a strong foundation for continued growth and development.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SessionCard;
