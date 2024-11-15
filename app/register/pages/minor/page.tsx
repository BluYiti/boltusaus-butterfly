'use client';

import React from 'react';
import Back from '@/components/Back';
import Image from 'next/image';
import RegisterForm from '@/register/pages/components/RegisterForm';

const RegisterPage: React.FC = () => {
    return (
        <div className='overflow-hidden flex flex-col items-center min-h-screen'>
            <Back />
            <h1 className="fixed top-5 left-20 text-[#2081c3] text-2xl md:text-3xl font-bold">Butterfly</h1>
            <Image 
                src={"/images/minorfly.png"} 
                alt='butterfly' 
                width={600} 
                height={600} 
                priority // Set priority for LCP
                className="fixed object-contain max-w-full h-auto 3xl:left-48 3xl:top-52 sm:left-28 sm:top-32" // Maintain aspect ratio
            />
            <div className="flex justify-end items-end mt-10">
                <div className="ml-[45rem]">
                    <RegisterForm 
                        isAdult={false}
                        error={null} 
                    />
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
