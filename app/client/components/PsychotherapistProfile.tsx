import React from 'react';

type Psychotherapist = {
  $id: string;
  firstName: string;
  lastName: string;
  specialties: string;
  position?: string;
  description?: string;
  background?: string;
  phonenum?: string;
  imageUrl: string;
};

interface PsychotherapistProfileProps {
  psychotherapist: Psychotherapist;
  onClose: () => void;
}

const PsychotherapistProfile: React.FC<PsychotherapistProfileProps> = ({ psychotherapist, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-[90%] sm:w-[80%] md:w-[60%] lg:w-[50%] max-w-2xl overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-blue-400">
            {psychotherapist.firstName} {psychotherapist.lastName}
          </h2>
          <button 
            onClick={onClose} 
            className="text-3xl text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            &times;
          </button>
        </div>

        {/* Profile Image and Info */}
        <div className="flex justify-center mb-6">
          <img
            src={psychotherapist.imageUrl || "/images/default-profile.png"}
            alt={`${psychotherapist.firstName} ${psychotherapist.lastName}`}
            className="rounded-full w-36 h-36 object-cover border-4 border-blue-500 shadow-md"
          />
        </div>

        {/* Specialties & Position */}
        <div className="text-center mb-4">
          <p className="text-xl font-medium text-gray-700">Specialties</p>
          <p className="text-lg text-gray-600">{psychotherapist.specialties}</p>
          <p className="text-lg text-gray-600 mt-2">
            <strong>Position:</strong> {psychotherapist.position || 'Not specified'}
          </p>
        </div>

        {/* Description - Always show title */}
        <div className="mt-6">
          <h4 className="text-xl font-semibold text-blue-400">Description</h4>
          {psychotherapist.description ? (
            <p className="text-gray-600">{psychotherapist.description}</p>
          ) : (
            <p className="text-gray-500">No description provided.</p>
          )}
        </div>

        {/* Background - Always show title */}
        <div className="mt-6">
          <h4 className="text-xl font-semibold text-blue-400">Background</h4>
          {psychotherapist.background ? (
            <p className="text-gray-600">{psychotherapist.background}</p>
          ) : (
            <p className="text-gray-500">No background information provided.</p>
          )}
        </div>

        {/* Phone Number - Always show title */}
        <div className="mt-6">
          <h4 className="text-xl font-semibold text-blue-400">Phone Number</h4>
          {psychotherapist.phonenum ? (
            <p className="text-gray-600">{psychotherapist.phonenum}</p>
          ) : (
            <p className="text-gray-500">Phone number not provided.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PsychotherapistProfile;
