'use client'

import React, { useState } from 'react';
import Image from 'next/image';
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
    name: 'Hanni Pham',
    title: 'Senior Psychotherapist',
    image: '/path_to_image/hanni.png', // Replace with your image path
    about: 'As a psychologist, my mission is to nurture mental well-being, offering compassionate support and guiding individuals towards resilience and personal growth.',
    background: 'Bachelor of Arts in Psychology',
    specialties: ['Health and Lifestyle', 'Mindfulness'],
  },
  {
    name: 'Bruno Gonzaga',
    title: 'Psychotherapist',
    image: '/path_to_image/bruno.png', // Replace with your image path
    about: 'Bruno is committed to helping clients navigate life\'s challenges by fostering resilience and self-awareness.',
    background: 'Master\'s in Clinical Psychology',
    specialties: ['Cognitive Behavioral Therapy', 'Stress Management'],
  },
  {
    name: 'Ariana Corales',
    title: 'Therapist',
    image: '/path_to_image/ariana.png', // Replace with your image path
    about: 'Ariana offers a safe and welcoming space to explore emotions and achieve personal growth.',
    background: 'Bachelor in Counseling',
    specialties: ['Emotional Regulation', 'Self-esteem Improvement'],
  },
  {
    name: 'Juan Karlos',
    title: 'Therapist',
    image: '/path_to_image/juan.png', // Replace with your image path
    about: 'Juan believes in a holistic approach to mental health, focusing on both emotional and physical well-being.',
    background: 'Diploma in Psychotherapy',
    specialties: ['Holistic Therapy', 'Mindfulness'],
  },
];

const Page: React.FC = () => {
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist>(therapists[0]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="text-center">
        <h1 className="text-2xl font-bold text-blue-500">Therapy</h1>
        <h2 className="text-lg font-semibold text-black mt-2">Select your Psychotherapist</h2>
      </header>

      <section className="flex justify-center mt-8">
        <div className="flex space-x-4">
          {therapists.map((therapist, index) => (
            <div key={index} className="flex flex-col items-center">
              <img
                src={therapist.image}
                alt={therapist.name}
                className={`w-20 h-20 rounded-full cursor-pointer ${selectedTherapist.name === therapist.name ? 'border-4 border-green-400' : 'border-2 border-transparent'}`}
                onClick={() => setSelectedTherapist(therapist)}
              />
              <p className="mt-2 text-sm font-semibold text-center">{therapist.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
        <div className="flex items-center mb-4">
          <img src={selectedTherapist.image} alt={selectedTherapist.name} className="w-16 h-16 rounded-full" />
          <div className="ml-4">
            <h3 className="text-lg font-bold text-black">{selectedTherapist.name}</h3>
            <p className="text-sm text-green-600">{selectedTherapist.title}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* About me */}
          <div>
            <h4 className="text-md font-bold text-black mb-2">About me</h4>
            <p className="text-gray-700">{selectedTherapist.about}</p>
          </div>

          {/* Professional Background */}
          <div>
            <h4 className="text-md font-bold text-black mb-2">Professional Background</h4>
            <p className="text-gray-700">{selectedTherapist.background}</p>

            <h4 className="text-md font-bold text-black mt-4">Specialties</h4>
            <ul className="list-disc list-inside text-gray-700">
              {selectedTherapist.specialties.map((specialty, index) => (
                <li key={index}>{specialty}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Page;
