'use client'

import { FaArrowLeft } from 'react-icons/fa';

const BackButton = () => {
    return (
        <button
        onClick={() => {
            if (typeof window !== "undefined") {
            window.location.replace('/');
            }
        }}  // Direct browser history navigation
        className="fixed z-10 top-4 left-4 p-3 bg-[#38b6ff] rounded-full shadow-md hover:bg-gray-300 focus:outline-none"
        aria-label="Go back"
        >
            <FaArrowLeft className="text-white text-bold" />
        </button>
    );
};

export default BackButton;
