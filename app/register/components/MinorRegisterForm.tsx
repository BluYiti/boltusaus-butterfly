import React, { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import termsContent from '@/constants/terms';
import privacyContent from '@/constants/privacy';
import TermsAndPrivacy from './TermsAndPrivacy';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

interface RegisterFormProps {
    onRegister: (data: {
        firstName: string;
        lastName: string;
        birthday: string;
        address: string;
        guardianName: string;
        guardianContactNumber: string;
        idFile: File | null;
        email: string;
        password: string;
    }) => void;
    error: string | null;
    loading: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister, error, loading }) => {
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [birthday, setBirthday] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [guardianName, setGuardianName] = useState<string>('');
    const [guardianContactNumber, setGuardianContactNumber] = useState<string>('');
    const [idFile, setIdFile] = useState<File | null>(null);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [rePassword, setRePassword] = useState<string>('');
    const [agreeToTerms, setAgreeToTerms] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [age, setAge] = useState<number | null>(null);

    const calculateAge = (birthDateString: string): number => {
        const birthDate = new Date(birthDateString);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const handleBirthdayChange = (date: string) => {
        setBirthday(date);
        const calculatedAge = calculateAge(date);
        setAge(calculatedAge);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setValidationError(null);

        // Check if age is under 18
        if (age === null || age >= 18) {
            setValidationError('Only minors are allowed to register.');
            return;
        }

        // Check password length
        if (password.length < 8) {
            setValidationError('Password must be at least 8 characters long.');
            return;
        }

        if (rePassword.length < 8) {
            setValidationError('Re-enter Password must be at least 8 characters long.');
            return;
        }

        if (password !== rePassword) {
            setValidationError('Passwords do not match.');
            return;
        }

        if (!agreeToTerms) {
            alert('You must agree to the terms and conditions before registering.');
            return;
        }

        onRegister({ firstName, lastName, birthday, address, guardianName, guardianContactNumber, idFile, email, password });
    };

    return (
        <div className="w-full p-8">
            <h2 className="text-center text-6xl text-[#4982ae] font-paintbrush">Register</h2>
            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                {error && <div className="text-red-600 text-lg font-bold">{error}</div>}
                {validationError && <div className="text-red-600 text-lg font-bold">{validationError}</div>}
                
                <div className="rounded-md shadow-sm space-y-2">
                    {/* First Name */}
                    <div>
                        <label htmlFor="firstName" className="block text-[#38b6ff] mb-1">First Name</label>
                        <input
                            id="firstName"
                            type="text"
                            required
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="border border-[#38b6ff] rounded-xl pl-3 pr-10 py-2 w-full text-gray-500"
                        />
                    </div>

                    {/* Last Name */}
                    <div>
                        <label htmlFor="lastName" className="block text-[#38b6ff] mb-1">Last Name</label>
                        <input
                            id="lastName"
                            type="text"
                            required
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="border border-[#38b6ff] rounded-xl pl-3 pr-10 py-2 w-full text-gray-500"
                        />
                    </div>

                    {/* Birthday and Age */}
                    <div className="flex space-x-2">
                        <div className="flex-1">
                            <label htmlFor="birthday" className="block text-[#38b6ff] mb-1">Birthday</label>
                            <input
                                id="birthday"
                                type="date"
                                required
                                value={birthday}
                                onChange={(e) => handleBirthdayChange(e.target.value)}
                                className="border border-[#38b6ff] rounded-xl pl-3 pr-10 py-2 w-full text-gray-500"
                            />
                        </div>
                        <div className="flex-none w-1/3">
                            <label className="block text-[#38b6ff] mb-1">Age</label>
                            <input
                                type="text"
                                value={age !== null ? age : ''}
                                readOnly
                                className="border border-[#38b6ff] rounded-xl pl-3 pr-10 py-2 w-full text-gray-500"
                            />
                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <label htmlFor="address" className="block text-[#38b6ff] mb-1">Address</label>
                        <input
                            id="address"
                            type="text"
                            required
                            placeholder="Address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="border border-[#38b6ff] rounded-xl pl-3 pr-10 py-2 w-full text-gray-500"
                        />
                    </div>

                    {/* Guardian Name */}
                    <div>
                        <label htmlFor="guardianName" className="block text-[#38b6ff] mb-1">Name of Guardian</label>
                        <input
                            id="guardianName"
                            type="text"
                            required
                            placeholder="Guardian's Name"
                            value={guardianName}
                            onChange={(e) => setGuardianName(e.target.value)}
                            className="border border-[#38b6ff] rounded-xl pl-3 pr-10 py-2 w-full text-gray-500"
                        />
                    </div>

                    {/* Contact Number of Guardian */}
                    <div>
                        <label htmlFor="guardianContactNumber" className="block text-[#38b6ff] mb-1">Contact Number of Guardian:</label>
                        <PhoneInput
                            country={'ph'}
                            value={guardianContactNumber}
                            onChange={setGuardianContactNumber}
                            inputClass="border border-[#38b6ff] rounded-xl pl-3 pr-10 py-2 w-full text-gray-500 mt-1"
                            containerClass="phone-input-container"
                            buttonClass="phone-input-button"
                            inputProps={{
                                name: 'guardianContactNumber',
                                required: true,
                                autoComplete: 'tel',
                            }}
                        />
                    </div>

                    {/* Upload ID of User */}
                    <div>
                        <label htmlFor="idFile" className="block text-[#38b6ff] mb-1">Upload ID of User</label>
                        <input
                            id="idFile"
                            type="file"
                            accept="image/png, image/jpeg, image/gif, image/webp"
                            onChange={(e) => {
                                const file = e.target.files ? e.target.files[0] : null;
                                if (file && !file.type.startsWith('image/')) {
                                    setValidationError('Please upload a valid image file (PNG, JPEG, GIF, WEBP).');
                                    setIdFile(null); // Reset the file input
                                } else {
                                    setValidationError(null);
                                    setIdFile(file);
                                }
                            }}
                            className="border border-[#38b6ff] rounded-xl w-full text-gray-500"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-[#38b6ff] mb-1">Email</label>
                        <input
                            id="email"
                            type="email"
                            required
                            placeholder="Example@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border border-[#38b6ff] rounded-xl pl-3 pr-10 py-2 w-full text-gray-500"
                        />
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <label htmlFor="password" className="block text-[#38b6ff] mb-1">Password</label>
                        <input
                            id="password"
                            type="password"
                            required
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border border-[#38b6ff] rounded-xl pl-3 pr-10 py-2 w-full text-gray-500"
                        />
                    </div>

                    {/* Re-enter Password */}
                    <div className="relative">
                        <label htmlFor="rePassword" className="block text-[#38b6ff] mb-1">Re-enter Password</label>
                        <input
                            id="rePassword"
                            type="password"
                            required
                            placeholder="********"
                            value={rePassword}
                            onChange={(e) => setRePassword(e.target.value)}
                            className="border border-[#38b6ff] rounded-xl pl-3 pr-10 py-2 w-full text-gray-500"
                        />
                    </div>
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
                    className={`bg-gradient-to-r from-[#38b6ff] to-[#4982ae] text-white font-bold py-2 px-4 rounded-xl transition-all duration-300 ease-in-out shadow-lg transform hover:scale-105 hover:shadow-xl ${!agreeToTerms ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>

            <TermsAndPrivacy 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                contentType={'terms'}
                termsContent={termsContent}
                privacyContent={privacyContent}
            />
        </div>
    );
};

export default RegisterForm;
