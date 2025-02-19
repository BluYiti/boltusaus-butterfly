'use client';

import { useEffect, useState } from 'react';
import React from 'react';
import Back from '@/components/Back';
import Image from 'next/image';
import RegisterForm from '@/register/pages/components/RegisterForm';

const RegisterPage: React.FC = () => {
    const [isClient, setIsClient] = useState(false);

    // Only run after the component mounts on the client
    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return null;  // Return nothing during SSR
    }

    return (
        <div className='overflow-hidden flex flex-col items-center min-h-screen'>
            <Back />
            <h1 className="fixed top-5 left-20 text-[#2081c3] text-2xl md:text-3xl font-bold">Butterfly</h1>
            <div className="hidden sm:block">
                <Image 
                    src={"/images/registerfly.png"} 
                    alt='butterfly' 
                    width={540} 
                    height={540} 
                    priority // Set priority for LCP
                    className="fixed object-contain max-w-full h-auto 3xl:left-48 3xl:top-64 sm:left-44  sm:top-44" // Maintain aspect ratio
                />
            </div>
            <div className="flex justify-end items-end w-full px-4 sm:px-0">
                <div className="w-full sm:w-auto sm:ml-[35rem]">
                    <RegisterForm 
                        isAdult={true}  // Pass the `isAdult` prop to indicate adult registration
                        error={null}
                    />
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
