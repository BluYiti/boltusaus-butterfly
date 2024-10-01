'use client';


import React from 'react';
import ClientList from '@/psychotherapist/components/ClientList';

const ClientListPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
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

      <main className="p-8 bg-blue-100 min-h-screen">
        <ClientList />
      </main>
    </div>
  );
};

export default ClientListPage;
