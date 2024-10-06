import React from "react";

const ConsultationCard: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-indigo-500">
      <div className="bg-white shadow-xl rounded-lg p-8 w-96">
        <div className="flex flex-col items-center text-center">
          <img
            src="https://i.pravatar.cc/100"
            alt="Hanni"
            className="w-24 h-24 rounded-full mb-4 shadow-lg"
          />
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">Hi Raianna!</h1>
          <p className="text-gray-600 mb-6">I'm Hanni, your psychologist.</p>
          <p className="text-gray-600 mb-8">Book your first live consultation</p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300">
            BOOK SESSION
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsultationCard;
