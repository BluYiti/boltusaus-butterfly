'use client'

import React, { useEffect, useState } from 'react';
import { account } from "@/appwrite"; // Ensure your SDK is correctly initialized
import { useRouter } from "next/navigation";

const VerifyPage: React.FC = () => {
    const router = useRouter();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('userId');
        const secret = decodeURIComponent(urlParams.get('secret') || ''); // Decode the secret if necessary
        console.log('Decoded userId:', userId, 'secret:', secret); // Log to check the values
        const verifyUser = async () => {
            try {
                const response = await account.updateVerification(userId, secret);
                console.log('Verification response:', response); // Log success response
            } catch (error) {
                console.error('Verification failed:', error); // Log the error for debugging
            }
        };
        verifyUser();
    }, [router]);    

    const handleLoginRedirect = () => {
        router.push('/login');
    };

    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-[#eff6ff]'>
            <div className="bg-white rounded-3xl p-10 shadow-lg text-center">
                <h2 className="text-3xl font-bold text-green-600">Account Verified!</h2>
                <p className="mt-4 text-gray-600">Your account has been successfully verified.</p>
                <button 
                    onClick={handleLoginRedirect} 
                    className="bg-[#4982ae] text-white text-lg w-36 h-12 mt-7 rounded-xl transition-all duration-300 hover:bg-[#3b6d88]"
                >
                    Go to Login
                </button>
            </div>
        </div>
    );
};

export default VerifyPage;
