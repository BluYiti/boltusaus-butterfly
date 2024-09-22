'use client'

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import BubbleAnimation from '@/app/preassessment/components/BubbleAnimation';

export default function Home() {
  const router = useRouter();

  const handlePreAssessmentClick = () => {
    router.push('/auth/register');
  };

  const handleLoginClick = () => {
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-300 via-blue-500 to-blue-700 animate-gradient-x relative overflow-hidden flex items-center justify-center">
      <div className="text-center z-10">
        <h1 className="title-text">A.M.Peralta Psychological Services</h1>
        <Image 
          src="/images/ButterflyLanding.png" 
          alt="Welcome Image" 
          width={150} 
          height={150} 
          className="mx-auto mb-6 mt-6"
        />
        <p className="text-white mt-4 mb-10">This is the start of your self-care journey.</p>
        <button
          onClick={handlePreAssessmentClick}
          className="bg-[#1e3c58] hover:bg-[#16304a] text-white font-bold py-2 px-4 rounded-3xl"
        >
          Get Started
        </button>
        <p className="mt-4">
          <a
            onClick={handleLoginClick}
            className="text-white hover:underline cursor-pointer"
          >
            I already have an account
          </a>
        </p>
      </div>
    
      <BubbleAnimation />
    </div>
  );
}
