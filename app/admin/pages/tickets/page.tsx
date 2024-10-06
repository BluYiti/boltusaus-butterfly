'use client'

// admin/pages/tickets.tsx
import Layout from "@/components/Sidebar/Layout";
import items from "@/admin/data/Links";

const Tickets = () => {
  return (
    <Layout sidebarTitle="Admin" sidebarItems={items}>
      <h1 className="text-2xl font-bold">Tickets</h1>
      <p>Track and manage tickets here.</p>
    </Layout>
  );
};

export default Tickets;
