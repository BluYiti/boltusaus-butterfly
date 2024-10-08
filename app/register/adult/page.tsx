'use client';

import React from 'react';
import Back from '@/components/Back';
import Image from 'next/image';
import { useRouter } from 'next/navigation'

const RegisterPage: React.FC = () => {
    const router = useRouter ();

    const handleMinor = () => {
        router.push('/register/minor');
    }

    const handleAdult = () => {
        router.push('/register/adult')
    }

    return (
        <div className='overflow-hidden flex flex-col items-center justify-center min-h-screen'>
            <Back />
            <h1 className="absolute top-5 left-20 text-[#2081c3] text-2xl md:text-3xl font-bold">Butterfly</h1>

            {/* Register heading centered vertically */}
            <h2 className='font-paintbrush absolute text-8xl text-[#2b4369] mb-96'>
                Register
            </h2>
        </div>
    );
};

export default RegisterPage;
