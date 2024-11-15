'use client';

import { useState } from 'react';
import Back from '@/components/Back';
import Image from 'next/image';
import ForgotPasswordForm from '../components/ForgotForm';
import { account } from '@/appwrite';

const ForgotPassword: React.FC = () => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (email: string) => {
        setLoading(true);
        setError(null);
        try {
            // Make a call to Appwrite's account service to send password reset email
            await account.createRecovery(email, `${window.location.origin}/reset-password`); // Reset password URL
            alert('Password reset link sent to your email!');
        } catch (err) {
            setError('Failed to send reset link. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex flex-col justify-between h-screen'>
            <div className='flex flex-col justify-center items-center'>
                <Back />
                <h1 className="absolute top-5 left-20 text-[#2081c3] text-2xl md:text-3xl font-bold">Butterfly</h1>
                <Image src={'/images/adultfly.png'} alt={'butterfly'} width={250} height={250} className='mt-20' />
                <h2 className="mt-4 text-3xl text-blue-800 font-poppins">Forgot Your Password?</h2>
                <p className='font-poppins mt-9'>Enter your registered email to receive a verification code.</p>
                <ForgotPasswordForm onSubmit={handleSubmit} error={error} loading={loading} />
            </div>
            <div className="absolute right-0 w-14 h-screen bg-cover bg-no-repeat" style={{ backgroundImage: `url('/images/rightblock.png')` }}></div>
            <footer className='text-gray-600 text-xs text-center'>© Butterfly 2024</footer>
        </div>
    );
};

export default ForgotPassword;
