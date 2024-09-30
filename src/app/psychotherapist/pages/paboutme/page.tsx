'use client';

import React, { useState } from 'react';

// Main Application Component
const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-4xl mx-auto my-10">
        <Profile />
        <About />
        <Details />
      </div>
    </div>
  );
};

// Header Component
const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center p-4 border-b">
      <div className="text-xl font-bold">Logo</div>
      <nav className="flex space-x-4">
      <a href="/psychotherapist" className="hover:text-black">Dashboard</a>
          <a href="/psychotherapist/pages/pclientlist" className="hover:text-black">Client List</a>
          <a href="/psychotherapist/pages/preports" className="hover:text-black">Reports</a>
          <a href="#" className="hover:text-black">Recordings</a>
          <a href="/psychotherapist/pages/presources" className="hover:text-black">Resources</a>
          <a href="/psychotherapist/pages/paboutme" className="hover:text-black">About</a>
      </nav>
    </header>
  );
};

// Profile Component
const Profile: React.FC = () => {
  return (
    <div className="flex items-center space-x-6 p-8">
      <img
        src="https://via.placeholder.com/100"
        alt="Profile"
        className="rounded-full w-24 h-24"
      />
      <div>
        <h1 className="text-2xl font-bold">Hanni Pham</h1>
        <span className="text-lg text-green-600 bg-green-100 px-3 py-1 rounded-md">
          Senior Psychotherapist
        </span>
      </div>
    </div>
  );
};

// EditableContent Component to handle renaming of content text
interface EditableContentProps {
  defaultValue: string;
}

const EditableContent: React.FC<EditableContentProps> = ({ defaultValue }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(defaultValue);

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div className="flex items-start space-x-2">
      {isEditing ? (
        <>
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="border rounded px-2 py-1 w-full"
            rows={3}
          />
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Save
          </button>
        </>
      ) : (
        <div className="flex w-full">
          <p className="text-gray-700">{value}</p>
          <button
            onClick={() => setIsEditing(true)}
            className="ml-2 text-blue-500 hover:underline"
          >
            Rename
          </button>
        </div>
      )}
    </div>
  );
};

// About Component with editable content
const About: React.FC = () => {
  return (
    <div className="p-8 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-semibold mb-2">About me</h2>
      <EditableContent defaultValue="As a psychologist, my mission is to nurture mental well-being, offering compassionate support and guiding individuals towards resilience and personal growth." />
    </div>
  );
};

// Details Component with editable content for Professional Background and Specialties
const Details: React.FC = () => {
  return (
    <div className="flex space-x-8 p-8">
      <div className="w-1/2 bg-white shadow-md rounded-md p-6">
        <h2 className="text-xl font-semibold mb-2">Professional Background</h2>
        <EditableContent defaultValue="Bachelor of Arts in Psychology" />
      </div>
      <div className="w-1/2 bg-white shadow-md rounded-md p-6">
        <h2 className="text-xl font-semibold mb-2">Specialties</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li><EditableContent defaultValue="Health and Lifestyle" /></li>
          <li><EditableContent defaultValue="Mindfulness" /></li>
        </ul>
      </div>
    </div>
  );
};

export default App;
