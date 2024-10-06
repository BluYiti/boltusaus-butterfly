'use client'

// admin/pages/security.tsx
import Layout from "@/components/Sidebar/Layout";
import items from "@/admin/data/Links";

const Security = () => {
  return (
    <Layout sidebarTitle="Admin" sidebarItems={items}>
      <h1 className="text-2xl font-bold">Security</h1>
      <p>Manage your security settings here.</p>
    </Layout>
  );
};

export default Security;