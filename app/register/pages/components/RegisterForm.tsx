'use client'

import React, { useState } from 'react';
import termsContent from '@/constants/terms';
import privacyContent from '@/constants/privacy';
import TermsAndPrivacy from '../../../components/TermsAndPrivacy';
import { RegisterFormProps } from './RegisterFormProps';
import useRegisterForm from '@/register/pages/components/RegisterComponents';
import 'react-phone-input-2/lib/style.css';
import { createSubmitHandler } from '@/register/pages/hooks/useSubmitRegister';
import { useFetchRegions } from '@/register/pages/hooks/useFetch/useFetchRegions';
import { useFetchProvinces } from '@/register/pages/hooks/useFetch/useFetchProvinces';
import { useFetchCities } from '@/register/pages/hooks/useFetch/useFetchCitiesAndMunicipalities';
import { useFetchBarangays } from '@/register/pages/hooks/useFetch/useFetchBarangays';
import { useRouter } from 'next/navigation';

const RegisterForm: React.FC<RegisterFormProps> = ({ isAdult, error }) => {
    const [isFocused, setIsFocused] = useState(false);
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
        passwordsMatch, setPasswordsMatch,
        agreeToTerms, setAgreeToTerms,
        isModalOpen, setIsModalOpen,
        validationError, setValidationError,
        age, setAge,
        regions, setRegions,
        selectedRegionCode, setSelectedRegionCode,
        provinces, setProvinces,
        cities, setCities,
        barangays, setBarangays,
        buttonClicked, setButtonClicked,
        loading, setLoading,
        modalContentType, setModalContentType
    } = useRegisterForm();

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
            router.push(`/register/pages/verify/email?user=${encodeURIComponent(userId)}`);
        },
        setValidationError,
    }, setLoading, setButtonClicked); // Pass setLoading and setButtonClicked here

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isFormValid()) {
            setButtonClicked(true); // Set buttonClicked to true when the button is clicked
            handleSubmit(e);  // Perform form submission logic
        }
    };

    // Use custom hooks to fetch data
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
    
        const minAge = 1;  // Minimum age (1 year old)
        const maxAge = 116; // Maximum age (116 years old)
    
        // Validate for age range between 1 and 116 years old
        if (calculatedAge < minAge) {
            setValidationError(`You must be at least ${minAge} year old to register.`);
        } else if (calculatedAge > maxAge) {
            setValidationError(`You must be ${maxAge} years old or younger to register.`);
        } else {
            // If age is within the valid range, check the isAdult condition
            if (isAdult) {
                // Check if age is greater than 18 (adult)
                if (calculatedAge < 18) {
                    setValidationError("You need to be an adult to register.");
                } else {
                    setValidationError(null); // No validation error if the user is an adult
                }
            } else {
                // If isAdult is false, check if age is less than 18 (minor)
                if (calculatedAge >= 18) {
                    setValidationError("You are not a minor and cannot register.");
                } else {
                    setValidationError(null); // No validation error if the user is a minor
                }
            }
        }
    };

    const validateEmail = (email) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
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

    // Function to validate the uploaded file (ID)
    const validateFile = (file: File | null) => {
        if (!file) return 'Please upload your ID file.';
        const validTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            return 'Please upload a valid image file (PNG, JPEG, GIF, WEBP).';
        }
        const maxSize = 5 * 1024 * 1024; // 5 MB
        if (file.size > maxSize) {
            return 'The uploaded file size should not exceed 5 MB.';
        }
        return null;
    };
    
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        validatePassword(newPassword);
    };
    
    const handleRePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newRePassword = e.target.value;
        setRePassword(newRePassword);
        setPasswordsMatch(newRePassword === password);
    };
    
    const isFormValid = () => {
        const isFirstNameValid = firstName.trim().length > 0;
        const isLastNameValid = lastName.trim().length > 0;
        const isBirthdayValid = birthday.trim().length > 0;
        const isAgeValid = age > 0;
        const isSexValid = sex.trim().length > 0;
        const isAddressValid = region && province && city && barangay;
        const isContactNumberValid = contactNumber.length === 12 && contactNumber.startsWith('63');
        const isEmergencyContactNameValid = emergencyContactName.trim().length > 0;
        const isEmergencyContactNumberValid = emergencyContactNumber.length === 12 && emergencyContactNumber.startsWith('63');
        const isEmailValid = validateEmail(email);
        const isPasswordValid = password.length >= 8 &&
                                /\d/.test(password) &&           // At least 1 number
                                /[!@#$%^&*(),.?":{}|<>]/.test(password) && // At least 1 special character
                                /[a-z]/.test(password) &&         // At least 1 lowercase letter
                                /[A-Z]/.test(password);           // At least 1 uppercase letter
        const doPasswordsMatch = password === rePassword;
        const isTermsAgreed = agreeToTerms;
        const isIdFileValid = idFile && !validateFile(idFile);
    
        return (
            isFirstNameValid &&
            isLastNameValid &&
            isBirthdayValid &&
            isAgeValid &&
            isSexValid &&
            isAddressValid &&
            isContactNumberValid &&
            isEmergencyContactNameValid &&
            isEmergencyContactNumberValid &&
            isEmailValid &&
            isPasswordValid &&
            doPasswordsMatch &&
            isTermsAgreed &&
            isIdFileValid
        );
    };

    return (
        <div className="w-full mt-8 p-8">
            <form className="3xl:mt-24 space-y-4" onSubmit={handleFormSubmit}>
                {error && <div className="text-red-600 text-lg font-bold">{error}</div>}
                {validationError && <div className="text-red-600 text-lg font-bold">{validationError}</div>}

                <div>
                {/* Two-Column Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 gap-y-0">
                    {/* First Name */}
                    <div>
                        <label htmlFor="firstName" className="block text-[#38b6ff]">First Name</label>
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
                        <label htmlFor="lastName" className="block text-[#38b6ff]">Last Name</label>
                        <input
                            id="lastName"
                            type="text"
                            required
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="border border-[#38b6ff] rounded-xl pl-3 pr-10 py-[0.35rem] w-full text-gray-500"
                        />
                    </div>

                    {/* Birthday and Age */}
                    <div className="flex space-x-2">
                        <div className="flex-1">
                            <label htmlFor="birthday" className="block text-[#38b6ff]">Birthday</label>
                            <input
                                id="birthday"
                                type="date"
                                required
                                value={birthday}
                                onChange={(e) => handleBirthdayChange(e.target.value)}
                                min="1900-01-01"  // Setting the minimum date to 1900
                                max="2099-12-31"  // Setting the maximum date to 2099
                                className="border border-[#38b6ff] rounded-xl pl-3 pr-10 py-[0.35rem] w-full text-gray-500"
                            />
                        </div>
                        <div className="flex-none w-1/3">
                            <label className="block text-[#38b6ff]">Age</label>
                            <input
                                type="text"
                                value={age !== null ? age : ''}
                                readOnly
                                className="border border-[#38b6ff] rounded-xl pl-3 pr-10 py-[0.325rem] w-full text-gray-500"
                            />
                        </div>
                    </div>

                    {/* Sex Dropdown */}
                    <div>
                        <label className="block text-[#38b6ff]">Sex</label>
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

                    {/* Country Dropdown */}
                    <div>
                        <label className="block text-[#38b6ff]">Country</label>
                        <select
                            className="border border-[#38b6ff] rounded-xl pl-3 pr-10 py-2 w-full text-gray-500"
                            value="Philippines" // Directly set the value to "Philippines"
                            onChange={() => {}} // No need to update state since it's fixed to "Philippines"
                            disabled // Option to prevent any changes (if the dropdown is meant to be fixed)
                        >
                            <option value="Philippines">Philippines</option> {/* Only "Philippines" option */}
                        </select>
                    </div>

                    {/* Region Dropdown */}
                    <div>
                        <label className="block text-[#38b6ff]">Region</label>
                        <select
                            className="border border-[#38b6ff] rounded-xl pl-3 pr-10 py-2 w-full text-gray-500"
                            value={region}
                            required
                            onChange={(e) => {
                                setCountry("Philippines");
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
                    <div>
                        <label className="block text-[#38b6ff]">Province</label>
                        <select
                            className="border border-[#38b6ff] rounded-xl pl-3 pr-10 py-2 w-full text-gray-500"
                            value={province}
                            required
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
                    <div>
                        <label className="block text-[#38b6ff]">City</label>
                        <select
                            className="border border-[#38b6ff] rounded-xl pl-3 pr-10 py-2 w-full text-gray-500"
                            value={city}
                            required
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
                        <label className="block text-[#38b6ff]">Barangay</label>
                        <select
                            className="border border-[#38b6ff] rounded-xl pl-3 pr-10 py-2 w-full text-gray-500"
                            value={barangay}
                            required
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
                    <div>
                        <label className="block text-[#38b6ff]">Street</label>
                        <input
                            className="border border-[#38b6ff] rounded-xl pl-3 pr-3 py-2 w-full text-gray-500"
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                            placeholder="Enter your street"
                            required
                        />
                    </div>

                    {/* Contact Number */}
                    <div>
                        <div className="flex items-center">
                            <label htmlFor="contactNumber" className="block text-[#38b6ff]">Contact Number</label>
                            <p className="text-xs text-red-500 ml-2">*No zero at the start</p> {/* Add message here */}
                        </div>
                        <input
                            type="tel"
                            id="contactNumber"
                            name="contactNumber"
                            value={contactNumber.startsWith('63') ? contactNumber.slice(2) : contactNumber}  // Display number without the leading '63' country code
                            onChange={(e) => {
                                // Allow only numeric input and restrict length to 11 digits
                                let value = e.target.value.replace(/[^\d]/g, '');  // Remove non-numeric characters
                                if (value.length <= 11) {
                                    // If the value starts with '0', remove it before adding the country code
                                    if (value.startsWith('0')) {
                                        value = value.slice(1);  // Remove leading '0'
                                    }
                                    setContactNumber(`63${value}`);  // Internally prepend '63' to the number
                                }
                            }}
                            className="border border-[#38b6ff] rounded-xl pl-3 pr-10 py-2 w-full text-gray-500"
                            required
                            autoComplete="tel"
                            maxLength={10}  // Limits input to 11 characters
                            inputMode="numeric"  // Suggest numeric keyboard on mobile
                        />
                    </div>

                    {/* Upload ID */}
                    <div>
                        <label htmlFor="idFile" className="block text-[#38b6ff]">
                        {isAdult ? "Upload ID" : "Upload ID of Parent / Guardian"}
                        </label>
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
                            className="border border-[#38b6ff] rounded-xl pl-2 pr-10 py-1 w-full text-gray-500 mt-1"
                        />
                    </div>

                    {/* Emergency Contact Name */}
                    <div>
                        <label htmlFor="emergencyContactName" className="block text-[#38b6ff]">Emergency Contact Name</label>
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
                        <div className="flex items-center">
                            <label htmlFor="contactNumber" className="block text-[#38b6ff]">Emergency Contact Number</label>
                            <p className="text-xs text-red-500 ml-2">*No zero at the start</p> {/* Add message here */}
                        </div>
                        <input
                            type="tel"
                            id="emergencyContactNumber"
                            name="emergencyContactNumber"
                            value={emergencyContactNumber.replace(/^63/, '')}  // Display only the 11 digits without the country code
                            onChange={(e) => {
                                // Allow only numeric input and restrict length to 11 digits
                                let value = e.target.value.replace(/[^\d]/g, '');  // Remove non-numeric characters
                                if (value.length <= 11) {
                                    // If the value starts with '0', remove it before adding the country code
                                    if (value.startsWith('0')) {
                                        value = value.slice(1);  // Remove leading '0'
                                    }
                                    setEmergencyContactNumber(`63${value}`);  // Internally prepend '63' to the number
                                }
                            }}
                            className="border border-[#38b6ff] rounded-xl pl-3 pr-10 py-2 w-full text-gray-500 mt-1"
                            required
                            autoComplete="tel"
                            maxLength={10}  // Limits input to 11 characters
                            inputMode="numeric"  // Suggest numeric keyboard on mobile
                        />
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <label htmlFor="password" className="block text-[#38b6ff]">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={handlePasswordChange}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            placeholder="********"
                            className={`border rounded-xl pl-3 pr-10 py-2 w-full text-gray-500 ${
                                isPasswordValid ? 'border-green-500' : 'border-red-500'
                            }`}
                        />
                        {/* Show password requirements only when the input is focused */}
                        {isFocused && (
                            <div className="absolute left-0 top-full mt-2 bg-white bg-opacity-95 border rounded-xl w-full p-2 text-sm text-gray-500 shadow-md">
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
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-[#38b6ff]">Email</label>
                        <input
                            id="email"
                            type="email"
                            required
                            placeholder="Example@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border border-[#38b6ff] rounded-xl pl-3 pr-10 py-2 w-full text-gray-500"
                            pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"  // Custom regex for better email format validation
                            title="Please enter a valid email address"  // Custom tooltip for invalid input
                        />
                        <p className="text-red-500 text-sm mt-1" id="emailError" style={{ display: email && !validateEmail(email) ? 'block' : 'none' }}>
                            Invalid email address. Please check the format.
                        </p>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label htmlFor="rePassword" className="block text-[#38b6ff]">Confirm Password</label>
                        <input
                        id="rePassword"
                        type="password"
                        required
                        placeholder="Confirm Password"
                        value={rePassword}
                        onChange={handleRePasswordChange}
                        className="border border-[#38b6ff] rounded-xl pl-3 pr-10 py-2 w-full text-gray-500"
                        />
                        {/* Visual indicator for password match */}
                        <div className="mt-2 text-sm">
                        {rePassword && (
                            <p className={`text-${passwordsMatch ? 'green' : 'red'}-500`}>
                            {passwordsMatch ? 'Passwords match!' : 'Passwords do not match.'}
                            </p>
                        )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div>
                        <input
                            type="checkbox"
                            checked={agreeToTerms}
                            onChange={() => setAgreeToTerms(!agreeToTerms)}
                            required
                        />
                        <label htmlFor="terms" className="text-gray-500 text-xs">
                            &nbsp;I agree to the
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
                        <div>
                            <button
                                type="submit"
                                disabled={loading || !isFormValid()} // Disable the button if form is invalid
                                aria-label="Submit registration form"
                                aria-disabled={loading || !isFormValid()}
                                className={`bg-gradient-to-r from-[#38b6ff] to-[#4982ae] text-white font-bold py-2 px-4 rounded-xl transition-all duration-300 ease-in-out shadow-lg transform hover:scale-105 hover:shadow-xl ${!isFormValid() ? 'opacity-50 cursor-not-allowed' : ''} ${buttonClicked ? 'bg-green-500' : ''}`}
                            >
                                {loading ? 'Registering...' : 'Register'}
                            </button>
                        </div>
                    </div>
                    
                    {error && <div className="text-red-600 text-lg font-bold">{error}</div>}
                    {validationError && <div className="text-red-600 text-lg font-bold">{validationError}</div>}
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
