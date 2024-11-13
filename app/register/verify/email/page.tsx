'use client'

import { useSearchParams } from 'next/navigation'; // Import from 'next/navigation' in Next.js 14
import React, { useEffect, useState } from 'react';
import { account } from '@/appwrite';
import Back from '@/components/Back';

const RegisterPage: React.FC = () => {
    const [email, setEmail] = useState<string | null>(null);
    const [isVerified, setIsVerified] = useState<boolean>(false); // New state to track verification status
    const searchParams = useSearchParams(); // Access search params
    const userId = searchParams ? searchParams.get('user') : null;

    useEffect(() => {
        const fetchUserEmail = async () => {
            if (userId) {
                try {
                    const session = await account.getSession('current');
                    if (session) {
                        const user = await account.get();
                        setEmail(user.email);
                    } else {
                        setEmail(null); // No permission
                    }
                } catch (error) {
                    console.error('Failed to fetch user:', error);
                    setEmail(null); // No permission
                }
            }
        };
    
        fetchUserEmail();
    }, [userId]);

    const handleVerify = async () => {
        try {
            await account.getSession('current');
            await account.createVerification("http://localhost:3000/register/verify/email/success");
            console.log('Verification email sent');
            setIsVerified(true); // Set the verification status to true
        } catch (error) {
            console.error('Failed to send verification email:', error);
        }
    };

    return (
        <div className='overflow-hidden flex flex-col items-center justify-center min-h-screen bg-[#f2f2f2]'>
            <Back />
            <h1 className="fixed top-5 left-20 text-[#2081c3] text-2xl md:text-3xl font-bold">Butterfly</h1>
            <div className="flex justify-center items-center mt-10">
                <div className="bg-white rounded-[2rem] px-10 py-10 shadow-lg relative w-full max-w-md md:max-w-lg lg:max-w-xl h-auto">
                    <h2 className="text-center text-7xl text-[#4982ae] font-paintbrush mb-10">Register</h2>
                    <div className="relative z-10 text-center font-poppins font-medium">
                        <h2 className="text-2xl text-[#333] mb-4">Verify your account</h2>
                        <p className="text-sm text-[#555] mb-6">
                            {userId ? (
                                email ? (
                                    <>
                                        Click the button below to verify <strong>{email}</strong><br />
                                        <button 
                                            onClick={handleVerify} 
                                            className={`bg-[#4982ae] text-white text-lg w-36 h-12 md:w-44 md:h-16 mt-7 rounded-xl transition-all duration-300 ${
                                                isVerified ? 'bg-gray-400 cursor-not-allowed' : ''
                                            }`} 
                                            disabled={isVerified}
                                        >
                                            {isVerified ? 'Sent' : 'Verify'}
                                        </button>
                                    </>
                                ) : (
                                    <span>No permission to access email. Please log in.</span> /* New message */
                                )
                            ) : (
                                <span>No email detected</span>
                            )}
                        </p>
                        <p className="text-sm text-[#333] mt-4">
                            If you didn&apos;t request this email, you can safely ignore it
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
