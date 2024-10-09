'use client'

// admin/pages/logs.tsx
import Layout from "@/components/Sidebar/Layout";
import items from "@/admin/data/Links";

const Logs = () => {
  return (
    <Layout sidebarTitle="Butterfly" sidebarItems={items}>
      <h1 className="text-2xl font-bold">Logs</h1>
      <p>View system logs here.</p>
    </Layout>
  );
};

export default Logs;
