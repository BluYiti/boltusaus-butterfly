'use client';

import React from 'react';
import { useRegister } from '@/app/register/hook/useRegister';
import RegisterForm from '@/app/register/components/RegisterForm';
import '@/app/login/styles/login.css';

const RegisterPage: React.FC = () => {
    const { register, error, loading } = useRegister();

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-500">
            <div className="flex bg-white rounded-lg shadow-lg max-w-4xl w-full overflow-hidden">
                
                <div className="w-1/2 bg-blue-100 flex flex-col items-center justify-center p-8">
                    <img
                        src="/images/ButterflyLanding.png"
                        alt="A.M.Peralta Psychological Services"
                        className="h-24 w-24 mb-4"
                    />
                    <h2 className="text-xl font-semibold text-center">
                        A.M.Peralta Psychological Services
                    </h2>
                </div>

                <div className="w-1/2 p-8">
                    <RegisterForm onRegister={register} error={error} loading={loading} />

                </div>
            </div>

            <div className="bubble-container">
                <div className="bubble bubble-1"></div>
                <div className="bubble bubble-2"></div>
                <div className="bubble bubble-3"></div>
            </div>
        </div>
    );
};

export default RegisterPage;

