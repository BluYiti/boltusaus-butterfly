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
          // Ensure window is available before using it
          if (typeof window !== 'undefined') {
            const recoveryLink = `${window.location.origin}/login/forgot/reset-password`;
            // Attempt to send the password reset email using Appwrite
            await account.createRecovery(email, recoveryLink);
            alert('Password reset link sent to your email!');
          } else {
            console.warn('window is not defined during SSR');
          }
        } catch (err: any) {
          // If error is caused by account not existing, show specific message
          if (err.code === 404) {
            setError('No account found with this email address.');
          } else if (err.code === 500) {
            setError('A server error occurred. Please try again later');
          } else {
            setError('Failed to send reset link. Please try again.');
          }
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
                <p className='font-poppins mt-9 text-center'>Enter your registered email to receive a verification code.</p>
                <ForgotPasswordForm onSubmit={handleSubmit} error={error} loading={loading} />
            </div>
            <div className="absolute right-0 w-14 h-screen bg-cover bg-no-repeat hidden md:block" style={{ backgroundImage: `url('/images/rightblock.png')` }}></div>
            <footer className='text-gray-600 text-xs text-center'>© Butterfly 2024</footer>
        </div>
    );
};

export default ForgotPassword;
