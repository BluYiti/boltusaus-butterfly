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
import { useFetchCities } from '@/register/hook/fetch/useFetchCities';
import { useFetchBarangays } from '@/register/hook/fetch/useFetchBarangays';
import { useRouter } from 'next/navigation';

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister, error, loading }) => {
    const router = useRouter();

    const {
        firstName, setFirstName,
        lastName, setLastName,
        birthday, setBirthday,
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
    } = useRegisterForm();

    // Inside your component
    const handleSubmit = createSubmitHandler({
        firstName,
        lastName,
        birthday,
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
            // Now you have access to the userId
            console.log('Registration successful:', data);
            const { userId } = data; // Extract the userId from data
            console.log('User ID:', userId); // You can see the userId here
            
            // Now use the userId in the URL param for verification
            router.push(`/register/verify/email/?user=${encodeURIComponent(userId)}`);
        },
        setValidationError,
    });

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

                    {/* Guardian Name */}
                    <div>
                        <label htmlFor="emergencyContactName" className="block text-[#38b6ff] mb-1">Name of Guardian</label>
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

                    {/* Contact Number of Guardian */}
                    <div>
                        <label htmlFor="emergencyContactNumber" className="block text-[#38b6ff] mb-1">Contact Number of Guardian</label>
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

                    {/* Upload ID of Guardian */}
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
                        &nbsp;and the
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
