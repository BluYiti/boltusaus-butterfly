'use client';

import React from 'react';
import Back from '@/components/Back';
import Image from 'next/image';
import AdultRegisterForm from '../components/AdultRegisterForm';

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
                <div className="ml-10">
                    <AdultRegisterForm 
                        onRegister={function (data: { firstName: string; lastName: string; birthday: string; address: string; contactNumber: string; idFile: File | null; email: string; password: string; }): void {
                            throw new Error('Function not implemented.');
                        }} 
                        error={null} 
                        loading={false} 
                    />
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
