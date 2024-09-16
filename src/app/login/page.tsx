import React from 'react';

const LoginPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-blue-100 flex items-center justify-center">
            {/* Main container that holds both the image and the form */}
            <div className="flex bg-white rounded-lg shadow-lg max-w-4xl w-full">
                
                {/* Left side with the logo and text */}
                <div className="w-1/2 flex flex-col items-center justify-center bg-blue-50 p-8">
                    <div className="flex flex-col items-center">
                        {/* Replace this path with your actual logo path */}
                        <img
                            src="/images/ButterflyLanding.png"
                            alt="A.M.Peralta Psychological Services"
                            className="h-24 w-24 mb-4"
                        />
                    </div>
                    <h2 className="text-xl font-semibold text-center">
                        A.M.Peralta Psychological Services
                    </h2>
                </div>

                {/* Right side with the login form */}
                <div className="w-1/2 p-8">
                    <h2 className="text-center text-2xl font-semibold">
                        WELCOME!
                    </h2>
                    <form className="mt-8 space-y-6">
                        <div className="rounded-md shadow-sm">
                            <input
                                id="username"
                                name="username"
                                type="text"
                                autoComplete="username"
                                required
                                className="
                                    appearance-none
                                    rounded-none
                                    relative
                                    block
                                    w-full
                                    px-3
                                    py-2
                                    border
                                    border-gray-300
                                    placeholder-gray-500
                                    text-gray-900
                                    rounded-t-md
                                    focus:outline-none
                                    focus:ring-indigo-500
                                    focus:border-indigo-500
                                    focus:z-10
                                    sm:text-sm
                                "
                                placeholder="Username"
                            />
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="
                                    appearance-none
                                    rounded-none
                                    relative
                                    block
                                    w-full
                                    px-3
                                    py-2
                                    border
                                    border-gray-300
                                    placeholder-gray-500
                                    text-gray-900
                                    rounded-b-md
                                    focus:outline-none
                                    focus:ring-indigo-500
                                    focus:border-indigo-500
                                    focus:z-10
                                    sm:text-sm
                                "
                                placeholder="Password"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="
                                        h-4
                                        w-4
                                        text-indigo-600
                                        focus:ring-indigo-500
                                        border-gray-300
                                        rounded
                                    "
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                    Remember Me
                                </label>
                            </div>
                            <div className="text-sm">
                                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                                    Forgot your password?
                                </a>
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="
                                    group
                                    relative
                                    w-full
                                    flex
                                    justify-center
                                    py-2
                                    px-4
                                    border
                                    border-transparent
                                    text-sm
                                    font-medium
                                    rounded-md
                                    text-white
                                    bg-blue-600
                                    hover:bg-blue-700
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-offset-2
                                    focus:ring-indigo-500
                                "
                            >
                                LOGIN
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
