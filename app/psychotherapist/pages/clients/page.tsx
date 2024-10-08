'use client';

import { useState } from "react";
import Layout from "@/components/Sidebar/Layout";
import items from "@/psychotherapist/data/Links";
import ClientList from '@/psychotherapist/components/ClientList'; // Import the ClientList component

const Clients = () => {
  const [activeTab, setActiveTab] = useState("Current");

  return (
    <Layout sidebarTitle="Butterfly" sidebarItems={items}>
      <div className="bg-gray-100 min-h-screen overflow-auto">
        <div className="bg-white rounded-b-lg shadow-md p-5 top-0 left-60 w-full z-10 sticky">
          <h2 className="text-2xl font-bold">Clients</h2>
        </div>

        <div className="mt-6 px-5">
          <ClientList />
        </div>
      </div>
    </Layout>
  );
};

export default Clients;
