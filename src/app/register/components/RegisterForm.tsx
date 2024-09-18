import React, { useState } from 'react';

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

                <div className="flex items-center mt-4">
                    <input
                        type="checkbox"
                        id="terms"
                        checked={agreeToTerms}
                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                        className="mr-2"
                    />
                    <label htmlFor="terms" className="text-gray-500 text-xs">
                        I agree to the
                        <a href="/terms" className="text-blue-500 hover:underline"> Terms and Conditions</a> and
                        <a href="/privacy" className="text-blue-500 hover:underline"> Privacy Policy</a>.
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
        </div>
    );
};

export default RegisterForm;
