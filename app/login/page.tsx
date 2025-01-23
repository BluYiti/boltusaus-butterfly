'use client';

import React, { useState } from 'react';
import { useLogin } from './hooks/useLogin';
import { useRouter } from 'next/navigation';
import LoginForm from './components/LoginForm';
import Back from '@/components/Back';

const LoginPage: React.FC = () => {
    const router = useRouter();
    const { login, error } = useLogin();
    const [loading, setLoading] = useState<boolean>(false);

    const handleLogin = async (email: string, password: string, rememberMe: boolean) => {
        setLoading(true);
        await login(email, password, rememberMe);
        setLoading(false);
    };

    const handleForgot = () =>  {
        router.push('/login/forgot');
    }

    const handleRegister = () =>  {
        router.push('/register');
    }

    return (
        <div className='overflow-hidden'>
            <Back/>
            <h1 className="absolute top-5 left-20 text-[#2081c3] text-2xl font-bold">Butterfly</h1>
            <h2 className='absolute font-paintbrush text-8xl text-[#2b4369] top-32 sm:left-16 2xl:left-20 3xl:left-36'>
                Start your Journey
            </h2>
            <div className='absolute w-2/5 h-screen'>
                <p className='absolute top-60 text-center left-24 text-[#2081c3] font-poppins'>
                    We believe that mental health is a collaborative effort. Together, we can navigate the path toward emotional well-being and mental strength.
                </p>
                <div className='absolute top-72 sm:left-52 2xl:left-56 3xl:left-72'>
                    <LoginForm onLogin={handleLogin} error={error} loading={loading} />
                    <div>
                        <a className="absolute top-[10.5rem] left-[8.5rem] text-blue-500 text-sm">
                            <button onClick={handleForgot} className='text-blue-400 underline'>Forgot password?</button>
                        </a>
                    </div>
                    <div>
                        <h2 className='absolute mt-20 ml-6 text-sm'>
                            Don&apos;t have an account?
                            <button onClick={handleRegister} className='text-blue-400 underline ml-2'>Register</button>
                        </h2> 
                    </div>
                </div>
            </div>
            <div className="absolute right-14 w-1/2 h-screen bg-cover bg-no-repeat" style={{ backgroundImage: `url('/images/adultfly.png')` }}></div>
            <div className="absolute right-0 w-14 h-screen bg-cover bg-no-repeat" style={{ backgroundImage: `url('/images/rightblock.png')` }}></div>
        </div>
    );
};

export default LoginPage;