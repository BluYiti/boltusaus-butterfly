import React, { useState } from 'react';

interface RegisterFormProps {
    onRegister: (username: string, email: string, password: string) => void;
    error: string | null;
    loading: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister, error, loading }) => {
    const [username, setUsername] = useState<string>(''); // State for username
    const [email, setEmail] = useState<string>(''); // State for email
    const [password, setPassword] = useState<string>(''); // State for password
    const [emailError, setEmailError] = useState<string | null>(null); // Email error state

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email); // Return true if email is valid, false otherwise
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateEmail(email)) {
            setEmailError('Invalid email format. Please enter a valid email address.');
            return;
        }
        setEmailError(null); // Reset email error if valid
        onRegister(username, email, password); // Call the register function with username, email, and password
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
                <button
                    type="submit"
                    disabled={loading}
                    className="btn-submit"
                >
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    );
};

export default RegisterForm;
