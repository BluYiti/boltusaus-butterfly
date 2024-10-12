import React from 'react';

interface FormData {
    firstName: string;
    lastName: string;
    birthday: string; // Assuming you're using a date string format
    password: string;
    rePassword: string;
    agreeToTerms: boolean;
    age: number | null;
    street: string;
    barangay: string;
    city: string;
    province: string;
    country: string;
    contactNumber: string;
    emergencyContactName: string;
    emergencyContactNumber: string;
    idFile: File | null;
    email: string;
    onRegister: (data: FormData) => void;
    setValidationError: (error: string | null) => void;
}

export const handleSubmit = (e: React.FormEvent<HTMLFormElement>, formData: FormData) => {
    e.preventDefault();
    formData.setValidationError(null);

    // Validate first name
    if (!formData.firstName.trim()) {
        formData.setValidationError('First Name is required.');
        return;
    }

    // Validate last name
    if (!formData.lastName.trim()) {
        formData.setValidationError('Last Name is required.');
        return;
    }

    // Validate birthday
    if (!formData.birthday) {
        formData.setValidationError('Birthday is required.');
        return;
    }

    // Check if age is under 18
    if (formData.age === null || formData.age < 18) {
        formData.setValidationError('Only minors are allowed to register.');
        return;
    }

    // Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
        formData.setValidationError('Please enter a valid email address.');
        return;
    }

    // Validate password
    if (formData.password.length < 8) {
        formData.setValidationError('Password must be at least 8 characters long.');
        return;
    }

    if (formData.rePassword.length < 8) {
        formData.setValidationError('Re-enter Password must be at least 8 characters long.');
        return;
    }

    if (formData.password !== formData.rePassword) {
        formData.setValidationError('Passwords do not match.');
        return;
    }

    // Validate terms agreement
    if (!formData.agreeToTerms) {
        formData.setValidationError('You must agree to the terms and conditions before registering.');
        return;
    }

    // Validate address fields
    if (!formData.street.trim()) {
        formData.setValidationError('Street is required.');
        return;
    }

    if (!formData.barangay.trim()) {
        formData.setValidationError('Barangay is required.');
        return;
    }

    if (!formData.city.trim()) {
        formData.setValidationError('City is required.');
        return;
    }

    if (!formData.province.trim()) {
        formData.setValidationError('Province is required.');
        return;
    }

    if (!formData.country.trim()) {
        formData.setValidationError('Country is required.');
        return;
    }

    // Validate contact numbers (basic format check)
    const phonePattern = /^\+?[0-9]{10,15}$/; // Adjust based on the phone format you expect
    if (!phonePattern.test(formData.contactNumber)) {
        formData.setValidationError('Please enter a valid contact number.');
        return;
    }

    if (!formData.emergencyContactName.trim()) {
        formData.setValidationError('Emergency Contact Name is required.');
        return;
    }

    if (!phonePattern.test(formData.emergencyContactNumber)) {
        formData.setValidationError('Please enter a valid emergency contact number.');
        return;
    }

    // Validate ID file upload
    if (!formData.idFile) {
        formData.setValidationError('Please upload your ID file.');
        return;
    }

    const address = `${formData.street}, ${formData.barangay}, ${formData.city}, ${formData.province}, ${formData.country}`;
    formData.onRegister(formData); // Pass the complete form data
};

// Wrapper function to use in the component
export const createSubmitHandler = (formData: FormData) => {
    return (e: React.FormEvent<HTMLFormElement>) => handleSubmit(e, formData);
};
