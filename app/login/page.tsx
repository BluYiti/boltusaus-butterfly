"use client"; // Mark this as a Client Component

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Use next/navigation instead of next/router
import { account } from '../appwrite'; // Adjust path to appwrite.ts
import { ID } from 'appwrite';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Updated import

  // Handle form submission
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      // Use createSession instead of createEmailSession
      const response = await account.createSession(username, password);
      console.log('Login successful:', response);

      // Fetch user account details
      const user = await account.get();
      const role = user.prefs.role; // Assuming role is stored in preferences

      // Redirect based on role
      switch (role) {
        case 'client':
          router.push('../client');
          break;
        case 'associate':
          router.push('../associate');
          break;
        case 'psychotherapist':
          router.push('../psychotherapist');
          break;
        case 'admin':
          router.push('../admin');
          break;
        default:
          setError('Role not found. Please contact support.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError('Invalid login credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-blue-100 flex items-center justify-center">
      <div className="flex bg-white rounded-lg shadow-lg max-w-4xl w-full">
        <div className="w-1/2 flex flex-col items-center justify-center bg-blue-50 p-8">
          <div className="flex flex-col items-center">
            <img
              src="/images/butterfly-logo.png"
              alt="A.M.Peralta Psychological Services"
              className="h-24 w-24 mb-4"
            />
          </div>
          <h2 className="text-black text-xl font-semibold text-center">
            A.M.Peralta Psychological Services
          </h2>
        </div>

        <div className="w-1/2 p-8">
          <h2 className="text-black text-center text-2xl font-semibold">
            WELCOME!
          </h2>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm">
              <input
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
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
          {error && <p className="mt-4 text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
