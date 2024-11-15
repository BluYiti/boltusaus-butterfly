'use client';

import { useState } from 'react';
import Back from '@/components/Back';
import Image from 'next/image';
import ForgotPasswordForm from '../components/ForgotForm';

const LoginPage: React.FC = () => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (email: string) => {
        setLoading(true);
        setError(null);
        try {
            // Replace with your API call to request a password reset
            await fakeApiCall(email);
            alert('Reset link sent!'); // Handle success (e.g., show success message)
        } catch (err) {
            setError('Failed to send reset link. Please try again.'); // Handle error
        } finally {
            setLoading(false);
        }
    };

    // Simulate API call for demonstration purposes
    const fakeApiCall = (email: string) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email === 'test@example.com') {
                    resolve('Success');
                } else {
                    reject(new Error('Invalid email'));
                }
            }, 2000);
        });
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

export default LoginPage;
