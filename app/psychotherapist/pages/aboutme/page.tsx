'use client'

import Layout from "@/components/Sidebar/Layout";
import items from "@/psychotherapist/data/Links";

const AboutMe = () => {
  return (
    <Layout sidebarTitle="Butterfly" sidebarItems={items}>
        <div className="bg-gray-100"> {/* Ensure it can scroll if content exceeds height */}
          <div className="bg-white rounded-b-lg shadow-md p-5 top-0 left-60 w-full z-10"> {/* Fixed position with full width */}
            <h2 className="text-2xl font-bold">About Me</h2>
          </div>

          {/* about me code*/}
        </div>
    </Layout>
  );
};

export default AboutMe;