'use client';

import React from 'react';
import Back from '@/components/Back';
import Image from 'next/image';
import MinorRegisterForm from '../components/MinorRegisterForm';

const RegisterPage: React.FC = () => {

    return (
        <div className='overflow-hidden flex flex-col items-center min-h-screen'>
            <Back />
            <h1 className="fixed top-5 left-20 text-[#2081c3] text-2xl md:text-3xl font-bold">Butterfly</h1>
            <div className="flex justify-center items-center mt-10">
                <div className="flex-shrink-0">
                    <Image 
                        src={"/images/registerfly.png"} 
                        alt='butterfly' 
                        width={600} 
                        height={600} 
                        priority // Set priority for LCP
                        className="object-contain max-w-full h-auto" // Maintain aspect ratio
                    />
                </div>
                <div className="ml-10 bg-white border-0 shadow-none">
                    <MinorRegisterForm 
                        onRegister={function (): void {
                            throw new Error('Function not implemented.');
                        } } 
                        error={null} 
                        loading={false} />
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
