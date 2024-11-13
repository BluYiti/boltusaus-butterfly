'use client'

import React from 'react';
import termsContent from '@/constants/terms';
import privacyContent from '@/constants/privacy';
import TermsAndPrivacy from './TermsAndPrivacy';
import PhoneInput from 'react-phone-input-2';
import { RegisterFormProps } from '../hook/RegisterFormProps';
import useRegisterForm from '@/register/hook/RegisterComponents';
import 'react-phone-input-2/lib/style.css';
import { createSubmitHandler } from '@/register/hook/handleSubmitMinor';
import { useFetchCountries } from '@/register/hook/fetch/useFetchCountries';
import { useFetchRegions } from '@/register/hook/fetch/useFetchRegions';
import { useFetchProvinces } from '@/register/hook/fetch/useFetchProvinces';
import { useFetchCities } from '@/register/hook/fetch/useFetchCitiesAndMunicipalities';
import { useFetchBarangays } from '@/register/hook/fetch/useFetchBarangays';
import { useRouter } from 'next/navigation';

const RegisterForm: React.FC<RegisterFormProps> = ({ error }) => {
    const router = useRouter();

    const {
        firstName, setFirstName,
        lastName, setLastName,
        birthday, setBirthday,
        sex, setSex,
        country, setCountry,
        region, setRegion,
        province, setProvince,
        city, setCity,
        barangay, setBarangay,
        street, setStreet,
        contactNumber, setContactNumber,
        emergencyContactName, setEmergencyContactName,
        emergencyContactNumber, setEmergencyContactNumber,
        idFile, setIdFile,
        email, setEmail,
        password, setPassword,
        passwordCriteria, setPasswordCriteria,
        isPasswordValid, setIsPasswordValid,
        rePassword, setRePassword,
        agreeToTerms, setAgreeToTerms,
        isModalOpen, setIsModalOpen,
        validationError, setValidationError,
        age, setAge,
        countries, setCountries,
        regions, setRegions,
        selectedRegionCode, setSelectedRegionCode,
        provinces, setProvinces,
        cities, setCities,
        barangays, setBarangays,
        buttonClicked, setButtonClicked,
        loading, setLoading
    } = useRegisterForm();

    const [modalContentType, setModalContentType] = React.useState<'terms' | 'privacy'>('terms');

    // Inside your component
    const handleSubmit = createSubmitHandler({
        firstName,
        lastName,
        birthday,
        sex,
        password,
        rePassword,
        agreeToTerms,
        age,
        street,
        barangay,
        city,
        province,
        country,
        contactNumber,
        emergencyContactName,
        emergencyContactNumber,
        idFile,
        email,
        onRegister: (data) => {
            console.log('Registration successful:', data); // Now you have access to the userId
            const { userId } = data; // Extract the userId from data
            router.push(`/register/verify/email/?user=${encodeURIComponent(userId)}`);
        },
        setValidationError,
    }, setLoading, setButtonClicked); // Pass setLoading and setButtonClicked here

    // Use custom hooks to fetch data
    useFetchCountries(setCountries);
    useFetchRegions(setRegions);
    useFetchProvinces(selectedRegionCode, setProvinces);
    useFetchCities(province, provinces, setCities, setCity, setBarangays);
    useFetchBarangays(city, cities, setBarangays);
    
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

        // Validate age
        if (calculatedAge > 18) {
            setValidationError('You must be at 18 years old and below to register.');
        } else {
            setValidationError(null);
        }
    };

    const validatePassword = (password: string) => {
        const length = password.length >= 8;
        const number = /\d/.test(password);
        const specialChar = /[@$!%*?&]/.test(password);
        const uppercase = /[A-Z]/.test(password);
        const lowercase = /[a-z]/.test(password);

        setPasswordCriteria({
            length,
            number,
            specialChar,
            uppercase,
            lowercase,
        });

        setIsPasswordValid(length && number && specialChar && uppercase && lowercase);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        validatePassword(newPassword);
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

                    {/* Sex Dropdown */}
                    <div className="mb-4">
                        <label className="block text-[#38b6ff] mb-2">Sex</label>
                        <select
                            className="border border-[#38b6ff] rounded-xl pl-3 pr-10 py-2 w-full text-gray-500"
                            value={sex}
                            onChange={(e) => setSex(e.target.value)}
                        >
                            <option value="">Select Sex</option>
                            {["Male", "Female"].map((gender) => (
                                <option key={gender} value={gender}>
                                    {gender}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Address */}
                    <div className="mt-4">
                        <label className="block text-[#38b6ff] mb-2">Address</label>
                        <div className="ml-4">
                            {/* Country Dropdown */}
                            <div className="mb-4">
                                <label className="block text-[#38b6ff] mb-2">Country</label>
                                <select
                                    className="border border-[#38b6ff] rounded-xl pl-3 pr-10 py-2 w-full text-gray-500"
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                >
                                    <option value="">Select Country</option>
                                    {countries
                                        .sort((a, b) => a.name.common.localeCompare(b.name.common))
                                        .map((country) => (
                                            <option key={country.name.common} value={country.name.common}>
                                                {country.name.common}
                                            </option>
                                        ))}
                                </select>
                            </div>

                            {/* Region Dropdown */}
                            <div className='mb-4'>
                                <label className="block text-[#38b6ff] mb-2">Region</label>
                                <select
                                    className="border border-[#38b6ff] rounded-xl pl-3 pr-10 py-2 w-full text-gray-500"
                                    value={region}
                                    onChange={(e) => {
                                        const selectedRegion = regions.find(r => r.name === e.target.value);
                                        setRegion(e.target.value);
                                        setSelectedRegionCode(selectedRegion?.code ?? null); // Use nullish coalescing to handle undefined
                                        setProvince(''); // Reset province when region changes
                                        setCity(''); // Reset city when region changes
                                        setBarangay(''); // Reset barangay when region changes
                                        setProvinces([]); // Clear provinces
                                        setCities([]); // Clear cities
                                        setBarangays([]); // Clear barangays
                                    }}
                                >
                                    <option value="">Select Region</option>
                                    {regions
                                        .sort((a, b) => a.name.localeCompare(b.name))
                                        .map((region) => (
                                            <option key={region.code} value={region.name}>
                                                {region.name}
                                            </option>
                                        ))}
                                </select>
                            </div>

                            {/* Province Dropdown */}
                            <div className="mb-4">
                                <label className="block text-[#38b6ff] mb-2">Province</label>
                                <select
                                    className="border border-[#38b6ff] rounded-xl pl-3 pr-10 py-2 w-full text-gray-500"
                                    value={province}
                                    onChange={(e) => {
                                        setProvince(e.target.value);
                                        setCity(''); // Reset city when province changes
                                        setBarangays([]); // Clear barangays when province changes
                                    }}
                                >
                                    <option value="">Select Province</option>
                                    {provinces
                                        .sort((a, b) => a.name.localeCompare(b.name))
                                        .map((province) => (
                                            <option key={province.code} value={province.name}>
                                                {province.name}
                                            </option>
                                        ))}
                                </select>
                            </div>

                            {/* City Dropdown */}
                            <div className="mb-4">
                                <label className="block text-[#38b6ff] mb-2">City</label>
                                <select
                                    className="border border-[#38b6ff] rounded-xl pl-3 pr-10 py-2 w-full text-gray-500"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                >
                                    <option value="">Select City</option>
                                    {cities
                                        .sort((a, b) => a.name.localeCompare(b.name))
                                        .map((city) => (
                                            <option key={city.code} value={city.name}>
                                                {city.name}
                                            </option>
                                        ))}
                                </select>
                            </div>

                            {/* Barangay Dropdown */}
                            <div>
                                <label className="block text-[#38b6ff] mb-2">Barangay</label>
                                <select
                                    className="border border-[#38b6ff] rounded-xl pl-3 pr-10 py-2 w-full text-gray-500"
                                    value={barangay}
                                    onChange={(e) => setBarangay(e.target.value)}
                                >
                                    <option value="">Select Barangay</option>
                                    {barangays
                                        .sort((b1, b2) => b1.name.localeCompare(b2.name))
                                        .map((b) => (
                                            <option key={b.code} value={b.name}>{b.name}</option>
                                        ))}
                                </select>
                            </div>

                            {/* Street Input */}
                            <div className="mb-4">
                                <label className="block text-[#38b6ff] mb-2">Street</label>
                                <input
                                    type="text"
                                    className="border border-[#38b6ff] rounded-xl pl-3 pr-3 py-2 w-full text-gray-500"
                                    value={street}
                                    onChange={(e) => setStreet(e.target.value)}
                                    placeholder="Enter your street"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact Number */}
                    <div>
                        <label htmlFor="contactNumber" className="block text-[#38b6ff] mb-1">Contact Number:</label>
                        <PhoneInput
                            country={'ph'}
                            value={contactNumber}
                            onChange={(phone) => {
                                let formattedPhone = phone;
                                if (!phone.startsWith('+')) {
                                    formattedPhone = `+${phone}`;
                                }
                                formattedPhone = formattedPhone.replace(/[^\d+]/g, '');
                                setContactNumber(formattedPhone);
                            }}
                            inputClass="border border-[#38b6ff] rounded-xl pl-3 pr-10 py-2 w-full text-gray-500 mt-1"
                            containerClass="phone-input-container"
                            buttonClass="phone-input-button"
                            inputProps={{
                                name: 'contactNumber',
                                required: true,
                                autoComplete: 'tel',
                            }}
                        />
                    </div>

                    {/* Emergency Contact Name */}
                    <div>
                        <label htmlFor="emergencyContactName" className="block text-[#38b6ff] mb-1">Emergency Contact Name</label>
                        <input
                            id="emergencyContactName"
                            type="text"
                            required
                            placeholder="Emergency Contact Name"
                            value={emergencyContactName}
                            onChange={(e) => setEmergencyContactName(e.target.value)}
                            className="border border-[#38b6ff] rounded-xl pl-3 pr-10 py-2 w-full text-gray-500"
                        />
                    </div>

                    {/* Emergency Contact Number */}
                    <div>
                        <label htmlFor="emergencyContactNumber" className="block text-[#38b6ff] mb-1">Emergency Contact Number</label>
                        <PhoneInput
                            country={'ph'}
                            value={emergencyContactNumber}
                            onChange={(phone) => {
                                let formattedPhone = phone;
                                if (!phone.startsWith('+')) {
                                    formattedPhone = `+${phone}`;
                                }
                                formattedPhone = formattedPhone.replace(/[^\d+]/g, '');
                                setEmergencyContactNumber(formattedPhone);
                            }}
                            inputClass="border border-[#38b6ff] rounded-xl pl-3 pr-10 py-2 w-full text-gray-500 mt-1"
                            containerClass="phone-input-container"
                            buttonClass="phone-input-button"
                            inputProps={{
                                name: 'emergencyContactNumber',
                                required: true,
                                autoComplete: 'tel',
                            }}
                        />
                    </div>

                    {/* Upload ID */}
                    <div>
                        <label htmlFor="idFile" className="block text-[#38b6ff] mb-1">Upload ID of Guardian</label>
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
                            value={password}
                            onChange={handlePasswordChange}
                            placeholder="********"
                            className={`border rounded-xl pl-3 pr-10 py-2 w-full text-gray-500 ${
                                isPasswordValid ? 'border-green-500' : 'border-red-500'
                            }`}
                        />

                        <div className="mt-2">
                            <p className={`text-sm ${passwordCriteria.length ? 'text-green-500' : 'text-red-500'}`}>
                                - At least 8 characters
                            </p>
                            <p className={`text-sm ${passwordCriteria.number ? 'text-green-500' : 'text-red-500'}`}>
                                - At least 1 number
                            </p>
                            <p className={`text-sm ${passwordCriteria.specialChar ? 'text-green-500' : 'text-red-500'}`}>
                                - At least 1 special character (@, $, !, %, *, ?, &)
                            </p>
                            <p className={`text-sm ${passwordCriteria.uppercase ? 'text-green-500' : 'text-red-500'}`}>
                                - At least 1 uppercase letter
                            </p>
                            <p className={`text-sm ${passwordCriteria.lowercase ? 'text-green-500' : 'text-red-500'}`}>
                                - At least 1 lowercase letter
                            </p>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="mb-4">
                        <label htmlFor="rePassword" className="block text-[#38b6ff] mb-2">Confirm Password</label>
                        <input
                            id="rePassword"
                            type="password"
                            required
                            placeholder="Confirm Password"
                            value={rePassword}
                            onChange={(e) => setRePassword(e.target.value)}
                            className="border border-[#38b6ff] rounded-xl pl-3 pr-10 py-2 w-full text-gray-500"
                        />
                    </div>

                    {/* Agree to Terms and Conditions */}
                    <div className="mb-4">
                        <input
                            id="terms"
                            type="checkbox"
                            checked={agreeToTerms}
                            onChange={(e) => setAgreeToTerms(e.target.checked)}
                            className="mr-2"
                        />
                        <label htmlFor="terms" className="text-gray-500 text-xs">
                            I agree to the
                            <button
                                type="button"
                                onClick={() => {
                                    setIsModalOpen(true);
                                    setModalContentType('terms');
                                }}
                                className="text-blue-500 hover:underline ml-1"
                            >
                                Terms and Conditions
                            </button>
                            &nbsp;and the
                            <button
                                type="button"
                                onClick={() => {
                                    setIsModalOpen(true);
                                    setModalContentType('privacy');
                                }}
                                className="text-blue-500 hover:underline ml-1"
                            >
                                Privacy Policy
                            </button>.
                        </label>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-8">
                    <button
                    type="submit"
                    disabled={loading || !agreeToTerms}
                    className={`bg-gradient-to-r from-[#38b6ff] to-[#4982ae] text-white font-bold py-2 px-4 rounded-xl transition-all duration-300 ease-in-out shadow-lg transform hover:scale-105 hover:shadow-xl ${!agreeToTerms ? 'opacity-50 cursor-not-allowed' : ''} ${buttonClicked ? 'bg-green-500' : ''}`}
                >
                    {loading ? 'Registering...' : 'Register'}
                </button>
                    </div>
                </div>
            </form>

            {/* Terms and Privacy Modal */}
            <TermsAndPrivacy
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                contentType={modalContentType}  
                termsContent={termsContent} 
                privacyContent={privacyContent}
            />
        </div>
    );
};

export default RegisterForm;

