'use client';

import React, { useState } from 'react';
import { FaEnvelope } from 'react-icons/fa';

interface ForgotPasswordFormProps {
    onSubmit: (email: string) => void;
    error: string | null;
    loading: boolean;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onSubmit, error, loading }) => {
    const [email, setEmail] = useState<string>('');

    

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(email);
    };

    return (
        <div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                {error && <div className="text-red-500 text-sm">{error}</div>}
                <div className="relative mt-8">
                    <label htmlFor="email" className="absolute -top-3 left-2 bg-white px-1 text-[#38b6ff]">
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border border-[#38b6ff] rounded-xl pl-3 pr-10 pt-4 pb-3 w-64 text-gray-500"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <FaEnvelope />
                    </div>
                </div>
                <div>
                    <button
                        type="submit"
                        className="btn-submit absolute mt-3 ml-6 text-lg rounded-xl bg-[#38b6ff] w-52 py-2 text-white"
                        disabled={loading}
                    >
                        {loading ? 'Sending...' : 'Request Reset Link'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ForgotPasswordForm;
