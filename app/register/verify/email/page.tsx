'use client'

import { useSearchParams } from 'next/navigation';  // Import from 'next/navigation' in Next.js 14
import React, { useEffect, useRef, useState } from 'react';
import { account } from '@/appwrite';
import Back from '@/components/Back';
import Image from 'next/image';

const RegisterPage: React.FC = () => {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [error, setError] = useState<boolean>(false);
    const [email, setEmail] = useState<string | null>(null);
    const searchParams = useSearchParams(); // Access search params
    // Safely get the email from searchParams if it's not null
    const userId = searchParams ? searchParams.get('user') : null;

    useEffect(() => {
        const fetchUserEmail = async () => {
            if (userId) {
                try {
                    const user = await account.get();
                    setEmail(user.email);
                } catch (error) {
                    console.error('Failed to fetch user:', error);
                }
            }
        };

        fetchUserEmail();
    }, [userId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;

        if (/[^0-9]/.test(value)) {
            setError(true);
            e.target.value = '';
            return;
        }

        setError(false);

        if (value && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && index > 0 && !inputRefs.current[index]?.value) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    return (
        <div className='overflow-hidden flex flex-col items-center justify-center min-h-screen'>
            <Back />
            <h1 className="fixed top-5 left-20 text-[#2081c3] text-2xl md:text-3xl font-bold">Butterfly</h1>
            <h2 className="text-center text-7xl text-[#4982ae] font-paintbrush">Register</h2>
            <div className="flex justify-center items-center mt-10">
                <div className="bg-[#e2e7ff] rounded-[2rem] px-10 py-10 shadow-lg relative"
                    style={{ width: '600px', height: '350px' }}>
                    
                    <div className="absolute inset-0 opacity-15">
                        <Image 
                            src="/images/registerfly.png" 
                            alt="Butterfly Background"
                            fill
                            style={{ objectFit: 'contain' }}
                            className="z-[-1]"
                        />
                    </div>

                    <div className="relative z-10 text-center font-poppins font-medium">
                        <h2 className="text-2xl text-[#333] mb-4">Verify your account</h2>
                        <p className="text-sm text-[#555] mb-6">
                            {userId ? (
                                <>
                                    We emailed you the six-digit code to <strong>{email}</strong><br />
                                    Enter the code below to verify your email address
                                </>
                            ) : (
                                <span>Email not found</span>
                            )}
                        </p>

                        <div className="flex justify-center gap-3 mb-4 relative">
                            {[...Array(6)].map((_, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type="text"
                                    maxLength={1}
                                    className="w-12 h-12 text-2xl border border-gray-300 rounded-lg text-center outline-none focus:border-blue-500"
                                    onChange={(e) => handleInputChange(e, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                />
                            ))}

                            {error && (
                                <div className="absolute top-[-25px] left-0 w-full text-center font-extrabold text-red-500 text-sm">
                                    Please input numbers only
                                </div>
                            )}
                        </div>

                        <button className="bg-[#2081c3] text-white px-6 py-2 rounded-lg mt-2">Verify</button>
                        
                        <p className="text-sm text-[#333] mt-4">
                            If you didn't receive a code <a href="#" className="text-[#2081c3]">RESEND</a><br />
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
