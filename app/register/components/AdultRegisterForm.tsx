import React, { useState, useEffect } from 'react';
import termsContent from '@/constants/terms';
import privacyContent from '@/constants/privacy';
import TermsAndPrivacy from './TermsAndPrivacy';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Country, Region, Province, City, Barangay } from '@/register/hook/AddressInterface';
import { createSubmitHandler } from '@/register/hook/handleSubmitAdult';

interface RegisterFormProps {
    onRegister: (data: {
        firstName: string;
        lastName: string;
        birthday: string;
        address: string;
        contactNumber: string;
        emergencyContactName: string;
        emergencyContactNumber: string;
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
    const [country, setCountry] = useState<string>('');
    const [region, setRegion] = useState<string>('');
    const [province, setProvince] = useState<string>('');
    const [city, setCity] = useState<string>('');
    const [barangay, setBarangay] = useState<string>('');
    const [street, setStreet] = useState<string>('');
    const [contactNumber, setContactNumber] = useState<string>('');
    const [emergencyContactName, setEmergencyContactName] = useState<string>('');
    const [emergencyContactNumber, setEmergencyContactNumber] = useState<string>('');
    const [idFile, setIdFile] = useState<File | null>(null);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [rePassword, setRePassword] = useState<string>('');
    const [agreeToTerms, setAgreeToTerms] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [age, setAge] = useState<number | null>(null);
    const [countries, setCountries] = useState<Country[]>([]);
    const [regions, setRegions] = useState<Region[]>([]);
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [barangays, setBarangays] = useState<Barangay[]>([]);

    // Inside your component
    const handleSubmit = createSubmitHandler({
        password,
        rePassword,
        agreeToTerms,
        age,
        street,
        barangay,
        city,
        province,
        country,
        onRegister,
        setValidationError,
    });

    // Fetch countries from API when component mounts
    useEffect(() => {
        fetch('https://restcountries.com/v3.1/all?fields=name,flags')
            .then((response) => response.json())
            .then((data) => {
                setCountries(data);
            })
            .catch((error) => {
                console.error('Error fetching country data:', error);
            });
    }, []);

    // Fetch regions from PSGC API when component mounts
    useEffect(() => {
        fetch('https://psgc.gitlab.io/api/regions/')
            .then((response) => response.json())
            .then((data) => {
                setRegions(data);
            })
            .catch((error) => {
                console.error('Error fetching region data:', error);
            });
    }, []);

    // Fetch provinces
    useEffect(() => {
        fetch('https://psgc.gitlab.io/api/provinces/')
            .then((response) => response.json())
            .then((data) => {
                setProvinces(data);
            })
            .catch((error) => {
                console.error('Error fetching province data:', error);
            });
    }, []);

    // Fetch cities
    useEffect(() => {
        fetch('https://psgc.gitlab.io/api/cities/')
            .then((response) => response.json())
            .then((data) => {
                setCities(data);
            })
            .catch((error) => {
                console.error('Error fetching city data:', error);
            });
    }, []);

    // Fetch barangays
    useEffect(() => {
        if (city) {
            const filteredBarangays = barangays.filter(b => b.city === city); // Adjust the filtering based on your data structure
            setBarangays(filteredBarangays);
        } else {
            setBarangays([]); // Reset if no city is selected
        }
    }, [city, barangays]);

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
        if (calculatedAge < 18) {
            setValidationError('You must be at least 18 years old to register.');
        } else {
            setValidationError(null);
        }
    };

    return (
        <div className="w-full p-8 bg-white border-0 shadow-none">
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
                            <div className="mb-4">
                                <label className="block text-[#38b6ff] mb-2">Region</label>
                                <select
                                    className="border border-[#38b6ff] rounded-xl pl-3 pr-10 py-2 w-full text-gray-500"
                                    value={region}
                                    onChange={(e) => setRegion(e.target.value)}
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
                                        .filter((c) => c.province === province) // Assuming each city has a 'province' property
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
                                    {barangays.map((b) => (
                                        <option key={b.code} value={b.name}>{b.name}</option> // Adjust based on your barangay object structure
                                    ))}
                                </select>
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
                        <label htmlFor="idFile" className="block text-[#38b6ff] mb-1">Upload ID</label>
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

