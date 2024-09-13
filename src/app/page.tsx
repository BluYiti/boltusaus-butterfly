'use client'
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-blue-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-black text-2xl font-bold">A.M.Peralta Psychological Services</h1>
        <Image 
          src="/images/ButterflyLanding.png" 
          alt="Welcome Image" 
          width={150} 
          height={150} 
          className="mx-auto mb-6 mt-6"
        />
        <p className="text-black mt-4 mb-10">This is the start of your self-care journey.</p>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-3xl"
        >
          GET STARTED
        </button>
        <p className="mt-4">
          <a
            href="#"
            className="text-blue-600 hover:underline"
          >
            I already have an account
          </a>
        </p>
      </div>
    </div>
  );
}
