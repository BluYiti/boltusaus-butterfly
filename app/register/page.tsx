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
        <div className='overflow-hidden flex flex-col items-center justify-center min-h-screen'>
            <Back />
            <h1 className="absolute top-5 left-20 text-[#2081c3] text-2xl md:text-3xl font-bold">Butterfly</h1>

            {/* Register heading centered vertically */}
            <h2 className='font-paintbrush absolute text-8xl text-[#2b4369] mb-96'>
                Register Page
            </h2>
            
            <div className='flex flex-col items-center mt-24'> {/* Add margin to push below the Register heading */}
                {/* Flex container for images */}
                <div className="flex justify-center space-x-60"> {/* Space between images */}
                    <button onClick={handleMinor} className="transform transition-transform duration-300 hover:scale-125">
                        <Image src={'/images/minor.png'} alt='minor2' width={225} height={225} /><br />
                        <h2 className='font-poppins'>Ages 17 and below</h2>
                        <h2 className='font-poppins text-blue-400 text-6xl'>Parent</h2>
                    </button>
                    <button onClick={handleAdult} className="transform transition-transform duration-300 hover:scale-125">
                        <Image src={'/images/adult.png'} alt='adult' width={225} height={225} /><br />
                        <h2 className='font-poppins'>Ages 18 and above</h2>
                        <h2 className='font-poppins text-blue-400 text-6xl'>Adult</h2>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;