import React, { useState } from 'react';
import termsContent from '@/app/auth/register/data/terms';
import privacyContent from '@/app/auth/register/data/privacy';
import TermsAndPrivacy from '@/app/auth/register/components/TermsAndPrivacy';


interface RegisterFormProps {
    onRegister: (username: string, email: string, password: string) => void;
    error: string | null;
    loading: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister, error, loading }) => {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [emailError, setEmailError] = useState<string | null>(null);
    const [agreeToTerms, setAgreeToTerms] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [contentType, setContentType] = useState<'terms' | 'privacy'>('terms');

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateEmail(email)) {
            setEmailError('Invalid email format. Please enter a valid email address.');
            return;
        }
        setEmailError(null);

        if (!agreeToTerms) {
            alert('You must agree to the terms and conditions before registering.');
            return;
        }

        onRegister(username, email, password);
    };

    const openModal = (type: 'terms' | 'privacy') => {
        setContentType(type);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="w-full p-8">
            <h2 className="text-center text-2xl font-semibold">Register</h2>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                {error && <div className="text-red-500 text-sm">{error}</div>}
                <div className="rounded-md shadow-sm space-y-4">
                    <input
                        id="username"
                        name="username"
                        type="text"
                        autoComplete="username"
                        required
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="input-style"
                    />
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-style"
                    />
                    {emailError && <div className="text-red-500 text-sm">{emailError}</div>}
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-style"
                    />
                </div>

                <div className="flex items-start mt-4 space-x-2">
                    <input
                        type="checkbox"
                        id="terms"
                        checked={agreeToTerms}
                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                        className="mt-1"
                    />
                    <label htmlFor="terms" className="text-gray-500 text-xs">
                        I agree to the
                        <button type="button" onClick={() => openModal('terms')} className="text-blue-500 hover:underline ml-1">Terms and Conditions</button>
                        &nbsp;and the&nbsp;
                        <button type="button" onClick={() => openModal('privacy')} className="text-blue-500 hover:underline ml-1">Privacy Policy</button>.
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={loading || !agreeToTerms}
                    className={`btn-submit ${!agreeToTerms ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>

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

export default RegisterForm;
