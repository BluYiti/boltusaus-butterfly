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
                <div className="hidden sm:block">
                    <Image 
                        src={"/images/minorfly.png"} 
                        alt='butterfly' 
                        width={500}
                        height={500}
                        priority // Set priority for LCP
                        className="fixed object-contain max-w-full h-auto 3xl:left-48 3xl:top-64 sm:left-8 sm:top-40 left-4 top-20" // Maintain aspect ratio
                    />
                </div>
                <div className="flex justify-end items-end w-full px-4 sm:px-0">
                    <div className="ml-0 sm:ml-[35rem] w-full sm:w-auto">
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