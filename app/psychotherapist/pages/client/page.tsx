'use client';


import React from 'react';
import ClientList from '@/psychotherapist/components/ClientList';
import Sidebar from '@/psychotherapist/components/SideBar';

const ClientListPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar></Sidebar>

      <main className="p-8 bg-blue-100 min-h-screen">
        <ClientList />
      </main>
    </div>
  );
};

export default ClientListPage;
