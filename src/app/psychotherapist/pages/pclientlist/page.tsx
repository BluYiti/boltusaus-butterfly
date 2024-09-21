'use client';
import React, { useEffect, useState } from 'react';

interface Client {
  initials: string;
  name: string;
  status: string; // Include status field for filtering (e.g., Current Client, Referred, To Be Evaluated)
}

const ClientList: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>('Current Clients'); // Dropdown state
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch all users from the server-side API
  const fetchClients = async () => {
    try {
      const response = await fetch('/api/users'); // Fetch data from API route
      const data = await response.json();

      const fetchedClients = data.users.map((user: any) => ({
        initials: `${user.name[0]}${user.name.split(' ')[1]?.[0] || ''}`,
        name: user.name,
        status: user.prefs?.status || 'Unknown', // Fetch status from preferences if available
      }));

      setClients(fetchedClients); // Set fetched users to the state
    } catch (error) {
      console.error('Error fetching clients:', error);
      setError('Failed to fetch client data.');
    }
  };

  useEffect(() => {
    fetchClients(); // Fetch all users on component mount
  }, []);

  const handleDropdownClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setShowDropdown(false); // Close dropdown after selecting an option
  };

  // Filter clients based on selected option
  const filteredClients = clients.filter((client) =>
    (selectedOption === 'Current Clients' && client.status === 'Current Client') ||
    (selectedOption === 'Referred Clients' && client.status === 'Referred') ||
    (selectedOption === 'To Be Evaluated' && client.status === 'To Be Evaluated')
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white shadow-md">
        <div className="flex items-center">
          <img src="/logo.png" alt="Logo" className="h-8" />
        </div>
        <nav className="flex space-x-6 text-gray-700">
          <a href="/psychotherapist" className="hover:text-black">Dashboard</a>
          <a href="/psychotherapist/pages/pclientlist" className="hover:text-black">Client List</a>
          <a href="/psychotherapist/pages/preports" className="hover:text-black">Reports</a>
          <a href="#" className="hover:text-black">Recordings</a>
          <a href="/psychotherapist/pages/presources" className="hover:text-black">Resources</a>
          <a href="/psychotherapist/pages/paboutme" className="hover:text-black">About</a>
        </nav>
      </header>

      {/* Main Content */}
      <div className="p-8 bg-blue-100 min-h-screen">
        {/* Dropdown for selecting client type */}
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
                <button
                  onClick={() => handleOptionClick('To Be Evaluated')}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  To Be Evaluated
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

        {/* Display filtered clients */}
        <div className="space-y-4">
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : filteredClients.length > 0 ? (
            filteredClients.map((client) => (
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
                    Review Pre-Assessment
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No clients available for the selected category.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientList;
