'use client'
import React, { useState } from 'react';

interface Client {
  initials: string;
  name: string;
}

const clients: Client[] = [
  { initials: 'GS', name: 'Gwen Stacey' },
  { initials: 'RJ', name: 'Robert Junior' },
  { initials: 'HA', name: 'Hev Abigail' },
  { initials: 'TE', name: 'Thomas Edison' },
];

const ClientList: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Current Clients');

  const handleDropdownClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setShowDropdown(false); // Close dropdown after selecting an option
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white shadow-md">
        <div className="flex items-center">
          <img src="/logo.png" alt="Logo" className="h-8" />
        </div>
        <nav className="flex space-x-6 text-gray-700">
          <a href="#" className="hover:text-black">Dashboard</a>
          <a href="#" className="hover:text-black">Client List</a>
          <a href="#" className="hover:text-black">Reports</a>
          <a href="#" className="hover:text-black">Recordings</a>
          <a href="#" className="hover:text-black">Resources</a>
          <a href="#" className="hover:text-black">About</a>
        </nav>
      </header>

      {/* Main Content */}
      <div className="p-8 bg-blue-100 min-h-screen">
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative">
            <button
              onClick={handleDropdownClick}
              className="bg-white text-black font-semibold rounded-lg px-4 py-2 flex items-center space-x-2"
            >
              <span>{selectedOption}</span>
              <span>{showDropdown ? '▴' : '▾'}</span>
            </button>
            {showDropdown && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => handleOptionClick('Current Clients')}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  Current Clients
                </button>
                <button
                  onClick={() => handleOptionClick('Referred Clients')}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  Referred Clients
                </button>
              </div>
            )}
          </div>
          <input
            type="text"
            placeholder="Search Client"
            className="border rounded-lg px-4 py-2 w-72 focus:outline-none"
          />
        </div>

        <div className="space-y-4">
          {clients.map((client) => (
            <div
              key={client.name}
              className="flex items-center justify-between bg-gray-50 rounded-lg p-4"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center font-semibold text-blue-700">
                  {client.initials}
                </div>
                <span className="font-semibold text-gray-800">{client.name}</span>
              </div>
              <div className="flex space-x-4">
                <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300">
                  Payment History
                </button>
                <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300">
                  Review Assessment
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClientList;
