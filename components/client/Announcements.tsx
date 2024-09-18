import React from "react";

const Announcements = () => {
  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Announcements</h1>
        <span className="text-xs text-gray-400">View All</span>
      </div>
      <div className="flex flex-col gap-4">
        <div className="bg-blue-600 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium ">
              You have an appointment this coming Thursday
            </h2>
            <span className="text-xs text-gray-400 bg-white rounded-full px-1 py-1">
              2024-09-16
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">September 19 2024</p>
        </div>
        <div className="bg-blue-600 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium ">
              The Psychotherapist has added resources.
            </h2>
            <span className="text-xs text-gray-400 bg-white rounded-full px-1 py-1">
              2024-09-17
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">added Service Directory Ad Content</p>
        </div>
      </div>
    </div>
  );
};

export default Announcements;
