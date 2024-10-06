'use client';

import React, { useState } from 'react';
import { useLogin } from './hooks/useLogin';
import LoginForm from './components/LoginForm';
import termsContent from '@/constants/terms';
import privacyContent from '@/constants/privacy';
import TermsAndPrivacy from '@/register/components/TermsAndPrivacy';
import Back from '@/components/Back';
import { FaEnvelope, FaEye} from 'react-icons/fa';

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
        <div className='overflow-hidden'>
            <Back/>
            <h1 className="absolute top-5 left-20 text-[#2081c3] text-2xl md:text-3xl font-bold ">Butterfly</h1>
            <h2 className='absolute font-paintbrush text-8xl text-[#2b4369] top-32 left-20'>
                Start your Journey
            </h2>
            <div className='absolute w-2/5 h-screen'>
                <p className='absolute top-60 text-center left-24 text-[#2081c3] font-poppins'>
                    We believe that mental health is a collaborative effort. Together, we can navigate the path toward emotional well-being and mental strength.
                </p>
                <div className='absolute top-72 left-52'>
                    <LoginForm onLogin={handleLogin} error={error} loading={loading} />
                </div>
            </div>
            <div className="absolute right-0 w-1/2 h-screen bg-cover bg-no-repeat" style={{ backgroundImage: `url('/images/loginfly.png')` }}></div>
        </div>
    );
};

export default LoginPage;
