'use client';

import React, { useState } from 'react';
import { useLogin } from '@/app/login/hooks/useLogin';
import LoginForm from '@/app/login/components/LoginForm';
import '@/app/login/styles/login.css';

const LoginPage: React.FC = () => {
    const { login, error } = useLogin();
    const [loading, setLoading] = useState<boolean>(false);

    const handleLogin = async (email: string, password: string) => {
        setLoading(true);
        await login(email, password);
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-500">
            <div className="flex bg-white rounded-lg shadow-lg max-w-4xl w-full overflow-hidden">
                
                {/* Left side with the logo */}
                <div className="w-1/2 flex flex-col items-center justify-center bg-blue-100 p-8">
                    <div className="flex flex-col items-center">
                        <img
                            src="/images/ButterflyLanding.png"
                            alt="A.M.Peralta Psychological Services"
                            className="h-24 w-24 mb-4"
                        />
                    </div>
                    <h2 className="text-xl font-semibold text-center">
                        A.M.Peralta Psychological Services
                    </h2>
                </div>

                {/* Right side with the login form */}
                <div className="w-1/2 p-8">
                    <LoginForm onLogin={handleLogin} error={error} loading={loading} />

                    <div className="text-center mt-4">
                        <p className="text-gray-500 text-sm">
                            By logging in, you agree to our
                            <a href="/terms" className="text-blue-500 hover:underline"> Terms and Conditions</a> and
                            <a href="/privacy" className="text-blue-500 hover:underline"> Privacy Policy</a>.
                        </p>
                    </div>
                </div>
            </div>

            {/* Background animation */}
            <div className="bubble-container">
                <div className="bubble bubble-1"></div>
                <div className="bubble bubble-2"></div>
                <div className="bubble bubble-3"></div>
            </div>
        </div>
    );
};

export default LoginPage;
