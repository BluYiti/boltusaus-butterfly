import React, { useState } from 'react';

interface LoginFormProps {
    onLogin: (email: string, password: string) => void;
    error: string | null;
    loading: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, error, loading }) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(email, password);
    };

    return (
        <div>
            <h2 className="text-center text-2xl font-semibold">WELCOME!</h2>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                {error && <div className="text-red-500 text-sm">{error}</div>}
                <div className="rounded-md shadow-sm">
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
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-style"
                    />
                </div>
                <button
                    type="submit"
                    className="btn-submit"
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
                <div className="text-center">
                    <label className="block text-gray-500">
                        <input type="checkbox" className="mr-1" />
                        Remember Me
                    </label>
                    <a href="#" className="text-blue-500 text-sm">
                        Forgot your password?
                    </a>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;
