// components/Sidebar/Loading.tsx
"use client";

import { FC } from "react";

interface LoadingProps {
  fullPage?: boolean;
}

const Loading: FC<LoadingProps> = ({ fullPage = false }) => {
  return (
    <div className={`${fullPage ? "fixed inset-0" : "h-screen"} flex items-center justify-center bg-gray-100`}>
      <div className="flex flex-col items-center">
        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-t-4 border-blue-700 border-t-transparent rounded-full animate-spin"></div>
        {/* Loading Message */}
        <p className="mt-4 text-lg text-gray-700">Loading, please wait...</p>
      </div>
    </div>
  );
};

export default Loading;
