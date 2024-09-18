'use client';

import React, { useState } from 'react';
import { useLogin } from '@/app/login/hooks/useLogin';
import LoginForm from '@/app/login/components/LoginForm'; // Import the LoginForm component
import '@/app/login/styles/login.css'; // Import your styles

const LoginPage: React.FC = () => {
    const { login, error } = useLogin(); // Hook for handling login logic
    const [loading, setLoading] = useState<boolean>(false);

    // Handle form submission in the LoginPage and pass it to LoginForm
    const handleLogin = async (email: string, password: string) => {
        setLoading(true);
        await login(email, password);
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-500">
            <div className="flex bg-white rounded-lg shadow-lg max-w-4xl w-full overflow-hidden">
                
                {/* Left Side - Logo and Information */}
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

                {/* Right Side - Login Form */}
                <div className="w-1/2 p-8">
                    <h2 className="text-center text-2xl font-semibold mb-6">Login</h2>
                    <LoginForm onLogin={handleLogin} error={error} loading={loading} />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
