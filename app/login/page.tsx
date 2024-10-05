'use client';

import React, { useState } from 'react';
import { useLogin } from './hooks/useLogin';
import LoginForm from './components/LoginForm';
import termsContent from '@/constants/terms';
import privacyContent from '@/constants/privacy';
import TermsAndPrivacy from '@/auth/register/components/TermsAndPrivacy';
import Back from '@/components/Back';
import BubbleAnimation from '@/components/BubbleAnimation';

const LoginPage: React.FC = () => {
    const { login, error } = useLogin();
    const [loading, setLoading] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [contentType, setContentType] = useState<'terms' | 'privacy'>('terms');

    const handleLogin = async (email: string, password: string) => {
        setLoading(true);
        await login(email, password);
        setLoading(false);
    };

    const openModal = (type: 'terms' | 'privacy') => {
        setContentType(type);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="min-h-screen flex bg-blue-100">
            <Back />
            <div className="flex w-full min-h-screen overflow-hidden">
                {/* Left side */}
                <div className="w-1/2 flex flex-col items-center justify-center bg-blue-100 p-8">
                    <div className="flex flex-col items-center">
                        <img
                            src="/images/ButterflyLanding.png"
                            alt="A.M.Peralta Psychological Services"
                            className="h-24 w-24 mb-4"
                        />
                    </div>
                    <h2 className="text-2xl font-semibold text-center">
                        A.M.Peralta Psychological Services
                    </h2>
                </div>

                {/* Right side - center the login form */}
                <div className="w-1/2 flex items-center justify-center p-8">
                    <div className="w-full max-w-md">
                        <LoginForm onLogin={handleLogin} error={error} loading={loading} />

                        <div className="text-center mt-4">
                            <p className="text-gray-500 text-sm">
                                By logging in, you agree to our
                                <button
                                    type="button"
                                    onClick={() => openModal('terms')}
                                    className="text-blue-500 hover:underline ml-1"
                                >
                                    Terms and Conditions
                                </button>
                                &nbsp;and&nbsp;
                                <button
                                    type="button"
                                    onClick={() => openModal('privacy')}
                                    className="text-blue-500 hover:underline"
                                >
                                    Privacy Policy
                                </button>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <BubbleAnimation />

            <TermsAndPrivacy
                isOpen={isModalOpen}
                onClose={closeModal}
                contentType={contentType}
                termsContent={termsContent}
                privacyContent={privacyContent}
            />
        </div>
    );
};

export default LoginPage;
