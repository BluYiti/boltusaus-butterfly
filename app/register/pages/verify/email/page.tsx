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
            await account.getSession('current');
            await account.createVerification("http://localhost:3000/register/pages/verify/email/success");
            console.log('Verification email sent');
            setIsVerified(true);
        } catch (error) {
            console.error('Failed to send verification email:', error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#eff6ff]">
            <Back />
            <h1 className="text-2xl font-bold text-[#2081c3]">Butterfly</h1>
            <div className="bg-white p-10 rounded-lg shadow-lg">
                <h2 className="text-7xl font-bold text-[#4982ae] mb-4">Register</h2>
                <div>
                    <h2>Verify your account</h2>
                    {userId && email ? (
                        <>
                            <p>
                                Click the button below to verify <strong>{email}</strong>
                            </p>
                            <button 
                                onClick={handleVerify} 
                                disabled={isVerified}
                                className={`button ${isVerified ? 'disabled' : ''}`}
                            >
                                {isVerified ? 'Sent' : 'Verify'}
                            </button>
                        </>
                    ) : (
                        <p>No email detected or no permission to access email.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const PageWithSuspense: React.FC = () => (
    <Suspense fallback={<div>Loading...</div>}>
        <RegisterPage />
    </Suspense>
);

export default PageWithSuspense;
