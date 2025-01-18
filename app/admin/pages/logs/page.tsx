'use client'

// admin/pages/logs.tsx
import Layout from "@/components/Sidebar/Layout";
import items from "@/admin/data/Links";
import useAuthCheck from "@/auth/page";
import LoadingScreen from "@/components/LoadingScreen";

const Logs = () => {
  const authLoading = useAuthCheck(['admin']);

  if (authLoading) return <LoadingScreen />;
  
  return (
    <Layout sidebarTitle="Butterfly" sidebarItems={items}>
      <div className="bg-white rounded-b-lg shadow-md p-5">
        <h2 className="text-2xl font-bold">Logs</h2>
      </div>
    </Layout>
  );
};

export default Logs;
