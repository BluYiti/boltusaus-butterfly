import React, { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import termsContent from '@/constants/terms';
import privacyContent from '@/constants/privacy';
import TermsAndPrivacy from './TermsAndPrivacy';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

interface RegisterFormProps {
    onRegister: (username: string, email: string, password: string, phone: string) => void;
    error: string | null;
    loading: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister, error, loading }) => {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [rePassword, setRePassword] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [agreeToTerms, setAgreeToTerms] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [contentType, setContentType] = useState<'terms' | 'privacy'>('terms');

    // State to handle password visibility toggle
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showRePassword, setShowRePassword] = useState<boolean>(false);

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone: string): boolean => {
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        return phoneRegex.test(phone);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setEmailError('Invalid email format. Please enter a valid email address.');
            return;
        }
        setEmailError(null);

        if (!validatePhone(phone)) {
            alert('Please enter a valid phone number.');
            return;
        }

        if (password !== rePassword) {
            setPasswordError('Passwords do not match.');
            return;
        }
        setPasswordError(null);

        if (!agreeToTerms) {
            alert('You must agree to the terms and conditions before registering.');
            return;
        }

        onRegister(username, email, password, phone);
    };

    return (
        <div className="w-full p-8">
            <h2 className="text-center text-2xl font-semibold">Register</h2>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                {error && <div className="text-red-500 text-sm">{error}</div>}
                <div className="rounded-md shadow-sm space-y-2">
                    {/* Username */}
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username:</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            autoComplete="username"
                            required
                            placeholder="Example"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="input-style mt-1"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            placeholder="Example@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-style mt-1"
                        />
                        {emailError && <div className="text-red-500 text-sm">{emailError}</div>}
                    </div>

                    {/* Phone Number */}
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number:</label>
                        <PhoneInput
                            country={'ph'}
                            value={phone}
                            onChange={(phone) => {
                               
                                let formattedPhone = phone;
                                if (!phone.startsWith('+')) {
                                    formattedPhone = `+${phone}`;
                                }
                                formattedPhone = formattedPhone.replace(/[^\d+]/g, '');
                                
                                console.log("Sanitized phone number:", formattedPhone);
                                setPhone(formattedPhone);
                            }}
                            inputClass="input-style mt-1"
                            containerClass="phone-input-container"
                            buttonClass="phone-input-button"
                            inputProps={{
                                name: 'phone',
                                required: true,
                                autoComplete: 'tel',
                            }}
                        />
                    </div>


                    {/* Password */}
                    <div className="relative">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="new-password"
                            required
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-style mt-1"
                        />
                        <button
                            type="button"
                            className="absolute right-2 top-10"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </div>

                    {/* Re-enter Password */}
                    <div className="relative">
                        <label htmlFor="rePassword" className="block text-sm font-medium text-gray-700">Re-enter Password:</label>
                        <input
                            id="rePassword"
                            name="rePassword"
                            type={showRePassword ? 'text' : 'password'}
                            autoComplete="new-password"
                            required
                            placeholder="********"
                            value={rePassword}
                            onChange={(e) => setRePassword(e.target.value)}
                            className="input-style mt-1"
                        />
                        <button
                            type="button"
                            className="absolute right-2 top-10"
                            onClick={() => setShowRePassword(!showRePassword)}
                        >
                            {showRePassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </div>
                    {passwordError && <div className="text-red-500 text-sm">{passwordError}</div>}
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
                        <button type="button" onClick={() => setIsModalOpen(true)} className="text-blue-500 hover:underline ml-1">Terms and Conditions</button>
                        &nbsp;and the&nbsp;
                        <button type="button" onClick={() => setIsModalOpen(true)} className="text-blue-500 hover:underline ml-1">Privacy Policy</button>.
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
                onClose={() => setIsModalOpen(false)}
                contentType={contentType}
                termsContent={termsContent}
                privacyContent={privacyContent}
            />
        </div>
    );
};

export default RegisterForm;