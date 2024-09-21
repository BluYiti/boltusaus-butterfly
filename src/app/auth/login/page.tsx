'use client';

import React, { useState } from 'react';
import { useLogin } from '@/app/auth/login/hooks/useLogin';
import LoginForm from '@/app/auth/login/components/LoginForm';
import '@/app/auth/login/styles/login.css';
import termsContent from '@/app/auth/register/data/terms';
import privacyContent from '@/app/auth/register/data/privacy';
import TermsAndPrivacy from '@/app/auth/register/components/TermsAndPrivacy';
import BubbleAnimation from '@/app/preassessment/components/BubbleAnimation';

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
        <div className="min-h-screen flex items-center justify-center bg-blue-500">
            <div className="flex bg-white rounded-lg shadow-lg max-w-4xl w-full overflow-hidden">
                
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

                <div className="w-1/2 p-8">
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
