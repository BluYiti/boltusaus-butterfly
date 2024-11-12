// app/pages/verify.tsx
'use client'

import React, { useEffect, useState } from 'react';
import { account } from "@/appwrite"; // Ensure your sdk is correctly initialized
import { useRouter } from "next/navigation";

const VerifyPage: React.FC = () => {
    const router = useRouter();
    const [isVerified, setIsVerified] = useState<boolean | null>(null); // State to track verification status
    const [loading, setLoading] = useState<boolean>(true); // State to track loading status

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('userId');
        const secret = urlParams.get('secret');
    
        console.log('userId:', userId, 'secret:', secret); // Log to check the values
    
        const verifyUser = async () => {
            if (userId && secret) {
                try {
                    console.log('Making verification request...');
                    const response = await account.updateVerification(userId, secret);
                    console.log('Verification response:', response); // Log success response
                    setIsVerified(true);
                } catch (error: any) {
                    console.error('Verification failed:', error); // Log the entire error object
                    setIsVerified(false);
                } finally {
                    setLoading(false);
                }
            } else {
                console.error('Missing userId or secret in the URL.');
                setIsVerified(false);
                setLoading(false);
            }
        };
    
        verifyUser();
    }, [router]);
    
    

    const handleLoginRedirect = () => {
        router.push('/login'); // Redirect to login page
    };

    if (loading) {
        return (
            <div className='flex items-center justify-center min-h-screen bg-[#f2f2f2]'>
                <h2 className="text-xl">Verifying your account...</h2>
            </div>
        );
    }

    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-[#f2f2f2]'>
            {isVerified === true ? (
                <div className="bg-white rounded-lg p-6 shadow-lg text-center">
                    <h2 className="text-2xl font-bold text-green-600">Account Verified!</h2>
                    <p className="mt-4 text-gray-600">Your account has been successfully verified.</p>
                    <button 
                        onClick={handleLoginRedirect} 
                        className="bg-[#4982ae] text-white text-lg w-36 h-12 mt-7 rounded-xl transition-all duration-300 hover:bg-[#3b6d88]"
                    >
                        Go to Login
                    </button>
                </div>
            ) : (
                <div className="bg-white rounded-lg p-6 shadow-lg text-center">
                    <h2 className="text-2xl font-bold text-red-600">Verification Failed!</h2>
                    <p className="mt-4 text-gray-600">There was a problem verifying your account. Please try again.</p>
                    <button 
                        onClick={handleLoginRedirect} 
                        className="bg-[#4982ae] text-white text-lg w-36 h-12 mt-7 rounded-xl transition-all duration-300 hover:bg-[#3b6d88]"
                    >
                        Go to Login
                    </button>
                </div>
            )}
        </div>
    );
};

export default VerifyPage;
