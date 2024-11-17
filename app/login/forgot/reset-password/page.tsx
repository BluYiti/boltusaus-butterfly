'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Back from '@/components/Back';
import { account } from '@/appwrite';
import Image from 'next/image';

const ResetPasswordPage: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();  // Use `useSearchParams` to access query params

    // Extract the 'userId' and 'secret' from query parameters
    const userId = searchParams.get('userId');
    const token = searchParams.get('secret');  // Get the token from query string

    const [newPassword, setNewPassword] = useState<string>('');
    const [rePassword, setRePassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [passwordCriteria, setPasswordCriteria] = useState({
        length: false,
        number: false,
        specialChar: false,
        uppercase: false,
        lowercase: false,
    });
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [passwordsMatch, setPasswordsMatch] = useState(true);

    // Validate the new password based on criteria
    const validatePassword = (password: string) => {
        const length = password.length >= 8;
        const number = /\d/.test(password);
        const specialChar = /[@$!%*?&]/.test(password);
        const uppercase = /[A-Z]/.test(password);
        const lowercase = /[a-z]/.test(password);

        // Update password criteria state
        setPasswordCriteria({
            length,
            number,
            specialChar,
            uppercase,
            lowercase,
        });

        // Check if the password meets all criteria
        setIsPasswordValid(length && number && specialChar && uppercase && lowercase);
    };

    // Handle changes in the new password input field
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setNewPassword(newPassword);
        validatePassword(newPassword);
    };

    // Handle changes in the confirm password input field
    const handleRePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newRePassword = e.target.value;
        setRePassword(newRePassword);
        setPasswordsMatch(newRePassword === newPassword);
    };

    // Handle form submission to reset the password
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate that both password fields are filled and passwords match
        if (!newPassword || !rePassword) {
            setError('Both password fields are required.');
            return;
        }

        if (!passwordsMatch) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            if (userId && token) {
                // Call Appwrite's recovery endpoint to reset the password
                await account.updateRecovery(userId, token, newPassword);
                alert('Your password has been reset successfully!');
                router.push('/login');  // Redirect user to the login page
            } else {
                setError('Invalid or missing userId or secret token.');
            }
        } catch (err) {
            setError('Failed to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Check if the recovery token and userId are available
    useEffect(() => {
        if (!userId || !token) {
            setError('No valid userId or token found in the URL.');
        }
    }, [userId, token]);

    return (
        <div className="flex flex-row justify-center items-center h-screen overflow-hidden">
            <Back />
            <h1 className="absolute top-5 left-20 text-[#2081c3] text-2xl md:text-3xl font-bold">Butterfly</h1>
            {/* Left side (Image) */}
            <div className="flex justify-center items-center w-1/2">
                <Image src={'/images/adultfly.png'} alt={'butterfly'} width={250} height={250} className='mt-20' />
            </div>

            {/* Right side (Form) */}
            <div className="flex flex-col justify-center items-center w-1/2">
                <h2 className="text-3xl text-blue-800 font-poppins">Reset Your Password</h2>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && <div className="text-red-500 text-sm">{error}</div>}

                    {/* Password Input */}
                    <div className="relative mt-8">
                        <label htmlFor="password" className="absolute -top-3 left-2 bg-white px-1 text-[#38b6ff]">
                            New Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            placeholder="Enter your new password"
                            value={newPassword}
                            onChange={handlePasswordChange}
                            className="border border-[#38b6ff] rounded-xl pl-3 pr-10 pt-4 pb-3 w-64 text-gray-500"
                        />
                    </div>

                    {/* Password Criteria */}
                    <div className="mt-2 text-sm">
                        <ul className="list-disc pl-5 text-gray-600">
                            <li style={{ color: passwordCriteria.length ? 'green' : 'red' }}>
                                Minimum length of 8 characters
                            </li>
                            <li style={{ color: passwordCriteria.number ? 'green' : 'red' }}>
                                At least one number
                            </li>
                            <li style={{ color: passwordCriteria.specialChar ? 'green' : 'red' }}>
                                At least one special character (@$!%*?&)
                            </li>
                            <li style={{ color: passwordCriteria.uppercase ? 'green' : 'red' }}>
                                At least one uppercase letter
                            </li>
                            <li style={{ color: passwordCriteria.lowercase ? 'green' : 'red' }}>
                                At least one lowercase letter
                            </li>
                        </ul>
                    </div>

                    {/* Confirm Password */}
                    <div className="mb-4">
                        <label htmlFor="rePassword" className="block text-[#38b6ff] mb-2">Confirm Password</label>
                        <input
                            id="rePassword"
                            name="rePassword"
                            type="password"
                            required
                            placeholder="Confirm your new password"
                            value={rePassword}
                            onChange={handleRePasswordChange}
                            className="border border-[#38b6ff] rounded-xl pl-3 pr-10 py-2 w-full text-gray-500"
                        />
                        {/* Visual indicator for password match */}
                        <div className="mt-2 text-sm">
                            {rePassword && (
                                <p className={`text-${passwordsMatch ? 'green' : 'red'}-500`}>
                                    {passwordsMatch ? 'Passwords match!' : 'Passwords do not match.'}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="btn-submit mt-3 ml-6 text-lg rounded-xl bg-[#38b6ff] w-52 py-2 text-white"
                            disabled={loading || !isPasswordValid || !passwordsMatch}
                        >
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Background Image on the Right */}
            <div className="absolute right-0 w-14 h-screen bg-cover bg-no-repeat" style={{ backgroundImage: `url('/images/rightblock.png')` }}></div>

            <footer className='text-gray-600 text-xs text-center absolute bottom-4 w-full'>
                © Butterfly 2024
            </footer>
        </div>
    );
};

export default ResetPasswordPage;
