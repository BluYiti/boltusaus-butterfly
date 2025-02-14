'use client';

import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState, Suspense } from 'react';
import { account } from '@/appwrite';
import Back from '@/components/Back';

const RegisterPage: React.FC = () => {
    const [email, setEmail] = useState<string | null>(null);
    const [isVerified, setIsVerified] = useState<boolean>(false);
    const searchParams = useSearchParams();
    const userId = searchParams?.get('user') ?? null;

    useEffect(() => {
        if (userId) {
            account.getSession('current')
                .then(() => account.get())
                .then(user => setEmail(user.email))
                .catch(err => {
                    console.error('Error fetching user:', err);
                    setEmail(null);
                });
        }
    }, [userId]);

    const handleVerify = async () => {
        try {
            setIsVerified(true); // Set the verification status to true
            console.log('Verification process started');
    
            // Ensure window is defined (avoiding SSR issues)
            const baseUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost' 
                ? 'http://localhost:3000' 
                : 'http://www.amperalta.com';
    
            await account.getSession('current');
            await account.createVerification(`${baseUrl}/register/pages/verify/email/success`);
            
            console.log('Verification email sent');
            setIsVerified(true);
        } catch (error) {
            console.error('Failed to send verification email:', error);
        }
    };    

    return (
        <div className="flex flex-col items-center justify-center min-h-screen relative bg-[#eff6ff]">
            <Back />
            <h1 className="fixed top-5 left-20 text-[#2081c3] text-2xl md:text-3xl font-bold">Butterfly</h1>
            <div className="flex flex-col items-center justify-center bg-white p-12 rounded-xl shadow-2xl w-full max-w-lg text-center">
                <h2 className="text-6xl text-[#4982ae] mb-6 font-paintbrush">Verify your account</h2>
                {userId && email ? (
                    <>
                        <p className="text-lg text-gray-600 mb-6">
                            Click the button below to verify <strong>{email}</strong>
                        </p>
                        <button
                            onClick={handleVerify}
                            disabled={isVerified}
                            className={`w-full py-3 px-6 text-white font-semibold rounded-lg transition-colors duration-300 ${
                                isVerified
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-[#2081c3] hover:bg-[#1565c0] active:bg-[#0f4a76]'
                            }`}
                        >
                            {isVerified ? 'Sent' : 'Verify'}
                        </button>
                    </>
                ) : (
                    <p className="text-lg text-red-600 mt-4">No email detected or no permission to access email.</p>
                )}
            </div>
            <div className="absolute right-0 top-0 w-14 h-screen bg-cover bg-no-repeat hidden md:block" style={{ backgroundImage: `url('/images/rightblock.png')` }}></div>
            <footer className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-gray-600 text-xs text-center">
                © Butterfly 2024
            </footer>
        </div>
    );    
};

const PageWithSuspense: React.FC = () => (
    <Suspense fallback={<div>Loading...</div>}>
        <RegisterPage />
    </Suspense>
);

export default PageWithSuspense;
