import React from 'react';
import { useRouter } from 'next/navigation';

const Welcome: React.FC = () => {
  const router = useRouter();

  const handleGetStartedClick = () => {
    router.push('/start');
  };

  const handleLoginClick = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-blue-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">A.M.Peralta Psychological Services</h1>
        <p className="mt-4 mb-10">This is the start of your self-care journey.</p>
        <button
          onClick={handleGetStartedClick}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          GET STARTED
        </button>
        <p className="mt-4">
          <a
            href="#"
            onClick={handleLoginClick}
            className="text-blue-600 hover:underline"
          >
            I already have an account
          </a>
        </p>
      </div>
    </div>
  );
};

export default Welcome;
