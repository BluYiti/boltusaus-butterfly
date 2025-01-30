'use client';

import React from 'react';
import Back from '@/components/Back';
import Image from 'next/image';
import { useRouter } from 'next/navigation'

const RegisterPage: React.FC = () => {
    const router = useRouter ();

    const handleMinor = () => {
        router.push('/register/pages/minor');
    }

    const handleAdult = () => {
        router.push('/register/pages/adult')
    }

    return (
        <div className='overflow-hidden flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8'>
            <Back />
            <h1 className="absolute top-5 left-5 sm:left-10 md:left-20 text-[#2081c3] text-xl sm:text-2xl md:text-3xl font-bold hidden sm:block">Butterfly</h1>

            {/* Register heading centered vertically */}
            <h2 className='font-paintbrush absolute text-3xl sm:text-5xl md:text-7xl lg:text-8xl text-[#2b4369] mb-24 sm:mb-32 md:mb-48 lg:mb-96 hidden sm:block'>
            Register Page
            </h2>

            {/* Responsive header for smaller screens */}
            <div className="block sm:hidden w-full text-center mt-4">
                <h2 className='font-paintbrush text-2xl text-[#2b4369]'>
                Register Page
                </h2>
            </div>
            
            <div className='flex flex-col items-center mt-24'> {/* Add margin to push below the Register heading */}
            {/* Flex container for images */}
            <div className="flex flex-col sm:flex-row justify-center space-y-10 sm:space-y-0 sm:space-x-10 md:space-x-60"> {/* Space between images */}
                <button onClick={handleMinor} className="transform transition-transform duration-300 hover:scale-125">
                <Image src={'/images/minor.png'} alt='minor2' width={225} height={225} /><br />
                <h2 className='font-poppins text-center'>Ages 17 and below</h2>
                <h2 className='font-poppins text-blue-400 text-4xl sm:text-5xl md:text-6xl text-center'>Parent</h2>
                </button>
                <button onClick={handleAdult} className="transform transition-transform duration-300 hover:scale-125">
                <Image src={'/images/adult.png'} alt='adult' width={225} height={225} /><br />
                <h2 className='font-poppins text-center'>Ages 18 and above</h2>
                <h2 className='font-poppins text-blue-400 text-4xl sm:text-5xl md:text-6xl text-center'>Adult</h2>
                </button>
            </div>
            </div>
        </div>
    );
};

export default RegisterPage;