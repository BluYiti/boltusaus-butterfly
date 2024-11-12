'use client';

import React, { useState, useEffect } from 'react';
import { useLogin } from './hooks/useLogin';
import { useRouter } from 'next/navigation';
import LoginForm from './components/LoginForm';
import Back from '@/components/Back';
import { account, databases } from '@/appwrite'; // Ensure this import is present
import LoadingScreen from "@/components/LoadingScreen";

const LoginPage: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);  // Start with true to show loading screen initially
    const router = useRouter();
    const { login, error } = useLogin();

    // UseEffect for session check
    useEffect(() => {
        const checkLoggedInUser = async () => {
            try {
                // Check if there is an active session
                const user = await account.get();
                if (user) {
                    // If a user is logged in, fetch their role
                    const role = await fetchUserRole(user.$id);
                    if (role) {
                        // Redirect based on role
                        handleUserRoleRedirect(role);
                    } else {
                        setLoading(false); // No role, just show login form
                    }
                } else {
                    setLoading(false); // No user session, show login form
                }
            } catch (err) {
                console.log('User is not logged in, proceeding to login page...');
                setLoading(false); // No session, show login form
            }
        };

        checkLoggedInUser();
    }, []); // Empty dependency array to run this effect only once when the component mounts

    // Fetch user role from the accounts collection
    const fetchUserRole = async (userId: string) => {
        try {
            const response = await databases.getDocument('Butterfly-Database', 'Accounts', userId);
            return response.role; // Adjust this based on your data structure
        } catch (err) {
            console.error('Failed to fetch user role:', err);
            return null;
        }
    };

    // Redirect based on user role and state
    const handleUserRoleRedirect = (role: string) => {
        switch (role) {
            case 'admin':
                router.push('/admin');
                break;
            case 'psychotherapist':
                router.push('/psychotherapist');
                break;
            case 'associate':
                router.push('/associate');
                break;
            case 'client':
                router.push('/client');
                break;
            default:
                console.log('Unknown role. Please contact support.');
        }
    };

    const handleLogin = async (email: string, password: string) => {
        setLoading(true);
        await login(email, password);
    };

    const handleForgot = () => {
        router.push('/login/forgot');
    };

    const handleRegister = () => {
        router.push('/register');
    };

    // Return the loading screen if session is being checked
    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <div className='overflow-hidden'>
            <Back />
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
                            Don't have an account?
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
