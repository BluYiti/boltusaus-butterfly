'use client'

import { useState } from 'react';
import { Country, Region, City, Province, Barangay } from '@/register/pages/components/RegisterFormProps'

const useRegisterForm = () => {
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [birthday, setBirthday] = useState<string>('');
    const [sex, setSex] = useState<string>('');
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
    const [passwordCriteria, setPasswordCriteria] = useState({
        length: false,
    });
    const [rePassword, setRePassword] = useState<string>('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [age, setAge] = useState<number | null>(null);
    const [countries, setCountries] = useState<Country[]>([]);
    const [regions, setRegions] = useState<Region[]>([]);
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
    const [selectedRegionCode, setSelectedRegionCode] = useState<string | null>(null);
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [barangays, setBarangays] = useState<Barangay[]>([]);
    const [buttonClicked, setButtonClicked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modalContentType, setModalContentType] = useState<'terms' | 'privacy'>('terms');

    return {
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
        rePassword, setRePassword,
        passwordsMatch, setPasswordsMatch,
        isPasswordValid, setIsPasswordValid,
        agreeToTerms, setAgreeToTerms,
        isModalOpen, setIsModalOpen,
        validationError, setValidationError,
        age, setAge,
        countries, setCountries,
        regions, setRegions,
        selectedRegion, setSelectedRegion,
        selectedRegionCode, setSelectedRegionCode,
        provinces, setProvinces,
        cities, setCities,
        barangays, setBarangays,
        buttonClicked, setButtonClicked,
        loading, setLoading,
        modalContentType, setModalContentType
    };
};

export default useRegisterForm;