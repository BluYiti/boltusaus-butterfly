'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { account } from '@/appwrite';

const ResetPasswordPage: React.FC = () => {
    const router = useRouter();
    const { token } = router.query;  // Extract the token from the URL query
    const [newPassword, setNewPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!newPassword) {
            setError('Password is required.');
            return;
        }

        const user = await account.get();
        const clientId = await user.$id;

        setLoading(true);
        setError(null);

        try {
            if (typeof token === 'string') {
                // Call Appwrite's recovery endpoint to reset the password
                await account.updateRecovery(clientId, token, newPassword);
                alert('Your password has been reset successfully!');
                router.push('/login');  // Redirect user to the login page
            } else {
                setError('Invalid or missing token.');
            }
        } catch (err) {
            setError('Failed to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token) {
            setError('No token found. Please check the reset link.');
        }
    }, [token]);

    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <h2 className="text-3xl text-blue-800 font-poppins">Reset Your Password</h2>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                {error && <div className="text-red-500 text-sm">{error}</div>}
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
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="border border-[#38b6ff] rounded-xl pl-3 pr-10 pt-4 pb-3 w-64 text-gray-500"
                    />
                </div>

                <div>
                    <button
                        type="submit"
                        className="btn-submit mt-3 ml-6 text-lg rounded-xl bg-[#38b6ff] w-52 py-2 text-white"
                        disabled={loading}
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ResetPasswordPage;
