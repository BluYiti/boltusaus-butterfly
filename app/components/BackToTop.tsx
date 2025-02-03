import React, { useEffect, useState } from 'react';
import { FaChevronUp } from 'react-icons/fa'; // Importing the up arrow icon

const BackToTopButton: React.FC = () => {
    const [isVisible, setIsVisible] = useState<boolean>(false);

    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
          // Add event listener only on the client side
          window.addEventListener('scroll', toggleVisibility);
    
          return () => {
            window.removeEventListener('scroll', toggleVisibility);
          };
        }
      }, []);

    return (
        <>
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-4 left-1/2 transform -translate-x-1/2 p-3 bg-blue-800 text-white rounded-full shadow-lg hover:bg-blue-700 transition z-50"
                    aria-label="Back to Top"
                >
                    <FaChevronUp size={24} /> {/* Using the imported icon */}
                </button>
            )}
        </>
    );
};

export default BackToTopButton;
