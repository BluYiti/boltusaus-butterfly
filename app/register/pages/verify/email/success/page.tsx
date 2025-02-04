'use client'

import React, { useEffect } from 'react';
import { account } from "@/appwrite"; // Ensure your SDK is correctly initialized
import { useRouter } from "next/navigation";
import Back from '@/components/Back';

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
            <Back />
            <h1 className="fixed top-5 left-20 text-[#2081c3] text-2xl md:text-3xl font-bold">Butterfly</h1>
            <div className="bg-white rounded-3xl p-10 shadow-lg text-center">
                <h2 className="text-6xl text-[#4982ae] mb-6 font-paintbrush">Account Verified!</h2>
                <p className="mt-4 text-gray-600">Your account has been successfully verified.</p>
                <button 
                    onClick={handleLoginRedirect} 
                    className="bg-[#4982ae] text-white text-lg w-36 h-12 mt-7 rounded-xl transition-all duration-300 hover:bg-[#3b6d88]"
                >
                    Go to Login
                </button>
            </div>
            <div className="absolute right-0 top-0 w-14 h-screen bg-cover bg-no-repeat hidden md:block" style={{ backgroundImage: `url('/images/rightblock.png')` }}></div>
            <footer className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-gray-600 text-xs text-center">
                © Butterfly 2024
            </footer>
        </div>
    );
};

export default VerifyPage;
