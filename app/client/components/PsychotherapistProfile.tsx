import React, { useState, useEffect } from 'react';
import { fetchProfileImageUrl } from '@/hooks/userService'; // Adjust import path as needed
import Image from 'next/image';

type Psychotherapist = {
  $id: string;
  firstName: string;
  lastName: string;
  specialties: string;
  position?: string;
  description?: string;
  background?: string;
  phonenum?: string;
  imageUrl?: string;  // Optional image URL (backup)
  profilepic?: string; // Profilepic attribute to fetch image from the bucket
};

interface PsychotherapistProfileProps {
  psychotherapist: Psychotherapist;
  onClose: () => void;
}

const PsychotherapistProfile: React.FC<PsychotherapistProfileProps> = ({ psychotherapist, onClose }) => {
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (psychotherapist.profilepic) {
        try {
          const imageUrl = await fetchProfileImageUrl(psychotherapist.profilepic);
          setProfileImageUrl(imageUrl || '/images/default-profile.png'); // Fallback image if no URL found
        } catch (error) {
          console.error("Error fetching profile image:", error);
          setProfileImageUrl('/images/default-profile.png'); // Fallback image on error
        }
      } else {
        setProfileImageUrl('/images/default-profile.png'); // Fallback image if no profilepic
      }
    };

    fetchProfileImage();
  }, [psychotherapist.profilepic]); // Dependency array makes sure this runs when the psychotherapist changes

  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-[90%] sm:w-[80%] md:w-[60%] lg:w-[50%] max-w-2xl overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center">
          <button 
            onClick={onClose} 
            className="text-3xl text-gray-600 hover:text-gray-900 focus:outline-none ml-auto"
          >
            &times;
          </button>
        </div>

        {/* Profile Image and Info */}
        <div className="flex flex-col justify-center items-center mb-2">
          <Image
            src={profileImageUrl || "/images/default-profile.png"}  // Fallback to default image
            alt={`${psychotherapist.firstName} ${psychotherapist.lastName}`}
            className="rounded-full object-cover border-4 border-blue-500 shadow-md"
            width={144}  // 36 * 4 (as 1rem = 4px)
            height={144} // 36 * 4 (as 1rem = 4px)
          />
          {/* Psychotherapist's name under the image */}
          <h3 className="mt-4 text-2xl font-semibold text-gray-700">
            {psychotherapist.firstName} {psychotherapist.lastName}
          </h3>
        </div>

        {/* Specialties & Position */}
        <div className="text-center mb-4">
            <div className="bg-green-100 p-2 rounded-full inline-block mt-1">
            <p className="text-sm text-green-700">
            <strong>Position:</strong> {psychotherapist.position ? `${psychotherapist.position.charAt(0).toUpperCase() + psychotherapist.position.slice(1)}` : 'Not specified'}
            </p>
            </div>
          <p className="text-lg font-medium text-gray-700">Specialties</p>
          <p className="text-sm text-gray-600">{psychotherapist.specialties}</p>
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
