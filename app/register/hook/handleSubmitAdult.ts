// handleSubmit.ts
import React from 'react';

interface FormData {
    password: string;
    rePassword: string;
    agreeToTerms: boolean;
    age: number | null;
    street: string;
    barangay: string;
    city: string;
    province: string;
    country: string;
    onRegister: (data: any) => void;
    setValidationError: (error: string | null) => void;
}

export const handleSubmit = (e: React.FormEvent<HTMLFormElement>, formData: FormData) => {
    e.preventDefault();
    formData.setValidationError(null);

    // Validation logic
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

    if (!formData.agreeToTerms) {
        alert('You must agree to the terms and conditions before registering.');
        return;
    }

    if (formData.age !== null && formData.age < 18) {
        formData.setValidationError('You must be at least 18 years old to register.');
        return;
    }

    const address = `${formData.street}, ${formData.barangay}, ${formData.city}, ${formData.province}, ${formData.country}`;
    formData.onRegister({ /* data object */ });
};

// Wrapper function to use in the component
export const createSubmitHandler = (formData: FormData) => {
    return (e: React.FormEvent<HTMLFormElement>) => handleSubmit(e, formData);
};
