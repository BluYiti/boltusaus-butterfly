'use client'

import { useState } from 'react';
import { redirect } from 'next/navigation'
import { registerUserWithRole } from '../../hooks/registerUserWithRole'; // Assuming the registration logic is in lib/user

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('client'); // Default role to 'client'
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setError('');  // Clear previous errors
      const result = await registerUserWithRole(email, password, role);
      
      if (result?.error) {
        setError(result.error); // Set the error from the result
      } else {
        // Handle successful registration (e.g., navigate to another page)
        console.log("Registration successful");
        redirect('/login') // Redirect to login or home page after registration
      }
    } catch (err) {
        setError("An unexpected error occurred during registration.");
        
        // Clear input fields if an unexpected error occurs
        setEmail('');
        setPassword('');
        setRole('user');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md">
        <h2 className="text-2xl font-bold text-center">Register</h2>

        {error && <p className="text-red-500">{error}</p>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium">
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="client">Client</option>
              <option value="associate">Associate</option>
              <option value="psychotherapist">Psychotherapist</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Register
          </button>
        </form>

        <p className="text-center">
          Already have an account?{' '}
          <a href="/login" className="text-blue-500">
            Log in here
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
