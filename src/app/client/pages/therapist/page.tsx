'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { account } from '@/app/appwrite'; // Import Appwrite account

// Therapist Interface
interface Therapist {
  name: string;
  title: string;
  image: string;
  about: string;
  background: string;
  specialties: string[];
}

const therapists: Therapist[] = [
  {
    name: "Hanni Pham",
    title: "Senior Psychotherapist",
    image: "/images/therapist1.jpg",
    about: "My mission is to nurture mental well-being, offering compassionate support and guiding individuals towards resilience and personal growth.",
    background: "Bachelor of Arts in Psychology",
    specialties: ["Health and Lifestyle", "Mindfulness"],
  },
  {
    name: "Bruno Gonzaga",
    title: "Psychotherapist",
    image: "/images/therapist2.jpg",
    about: "I focus on creating a safe space for clients to explore their emotions and experiences, helping them develop coping strategies and achieve mental clarity.",
    background: "Master of Science in Counseling Psychology",
    specialties: ["Cognitive Behavioral Therapy", "Anxiety Management"],
  },
  {
    name: "Ariana Marie",
    title: "Psychotherapist",
    image: "/images/therapist3.jpg",
    about: "I believe in a holistic approach to therapy, integrating mind, body, and spirit to help clients find balance and self-acceptance.",
    background: "Master of Arts in Clinical Psychology",
    specialties: ["Trauma Recovery", "Mindfulness-Based Stress Reduction"],
  },
];

const TherapistSelection: React.FC = () => {
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist>(therapists[0]);
  const router = useRouter(); // Initialize router

  const handleNextClick = async () => {
    try {
      console.log("Selected therapist to be saved:", selectedTherapist.name); // Log the selected therapist before saving
  
      // Save the selected therapist as a preference in Appwrite
      await account.updatePrefs({
        psychotherapist: selectedTherapist.name,
        role: 'client',
        status: 'To Be Evaluated',
      });
  
      // Check if the preference was saved successfully
      const userPrefs = await account.get(); // Fetch the updated user account to check preferences
      console.log("Updated preferences after saving:", userPrefs.prefs); // Log the updated preferences
  
      // Redirect to the consultation selection page
      router.push('/client/pages/availabledates');
    } catch (error) {
      console.error("Failed to save therapist preference:", error); // Log the error if something goes wrong
    }
  };

  return (
    <div className="text-black font-bold bg-gradient-to-r from-blue-300 via-blue-500 to-blue-700 animate-gradient-x relative overflow-hidden flex items-center justify-center min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-4">Select your Psychotherapist</h1>

        {/* Therapist Selection */}
        <div className="flex justify-around mb-6">
          {therapists.map((therapist, index) => (
            <div
              key={index}
              className={`cursor-pointer text-center ${selectedTherapist.name === therapist.name ? 'border-green-500' : ''}`}
              onClick={() => setSelectedTherapist(therapist)}
            >
              <img
                src={therapist.image}
                alt={therapist.name}
                className={`w-24 h-24 rounded-full mx-auto ${selectedTherapist.name === therapist.name ? 'border-4 border-green-500' : 'border-2 border-gray-300'}`}
              />
              <p className="mt-2 font-semibold">{therapist.name}</p>
            </div>
          ))}
        </div>

        {/* Selected Therapist Details */}
        <div className="border-t border-gray-300 pt-6">
          <h2 className="text-xl font-bold text-center mb-2">{selectedTherapist.name}</h2>
          <p className="text-center text-green-600 font-semibold mb-4">{selectedTherapist.title}</p>
          
          <div className="grid grid-cols-2 gap-4">
            {/* About Section */}
            <div>
              <h3 className="font-semibold text-lg">About me</h3>
              <p className="text-gray-600">{selectedTherapist.about}</p>
            </div>

            {/* Professional Background */}
            <div>
              <h3 className="font-semibold text-lg">Professional Background</h3>
              <p className="text-gray-600">{selectedTherapist.background}</p>
              <h3 className="font-semibold text-lg mt-4">Specialties</h3>
              <ul className="list-disc ml-4 text-gray-600">
                {selectedTherapist.specialties.map((specialty, index) => (
                  <li key={index}>{specialty}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Next Button */}
        <div className="text-center mt-8">
          <button
            onClick={handleNextClick}
            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TherapistSelection;
