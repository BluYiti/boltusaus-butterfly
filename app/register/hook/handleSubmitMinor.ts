'use client';

import { account, databases, createJWT, ID } from '@/appwrite';
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
    userId?: string; // Add userId to track user creation
    onRegister: (data: FormData) => void;
    setValidationError: (error: string | null) => void;
}

const validateName = (name: string, fieldName: string) => {
    if (!name.trim()) return `${fieldName} is required.`;
    return null;
};

const validateEmail = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email) ? null : 'Please enter a valid email address.';
};

const validatePhoneNumber = (number: string) => {
    const phonePattern = /^\+?[0-9]{10,15}$/; // Adjust based on expected phone format
    return phonePattern.test(number) ? null : 'Please enter a valid contact number.';
};

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, formData: FormData) => {
    e.preventDefault();
    formData.setValidationError(null);

    console.log('Email being used for registration:', formData.email);

    // Validate fields
    const validations = [
        validateName(formData.firstName, 'First Name'),
        validateName(formData.lastName, 'Last Name'),
        formData.birthday ? null : 'Birthday is required.',
        formData.age === null || formData.age >= 18 ? 'Only minors are allowed to register.' : null,
        validateEmail(formData.email),
        formData.password.length < 8 ? 'Password must be at least 8 characters long.' : null,
        formData.rePassword.length < 8 ? 'Re-enter Password must be at least 8 characters long.' : null,
        formData.password !== formData.rePassword ? 'Passwords do not match.' : null,
        formData.agreeToTerms ? null : 'You must agree to the terms and conditions before registering.',
        validateName(formData.street, 'Street'),
        validateName(formData.barangay, 'Barangay'),
        validateName(formData.city, 'City'),
        validateName(formData.province, 'Province'),
        validateName(formData.country, 'Country'),
        validatePhoneNumber(formData.contactNumber),
        validateName(formData.emergencyContactName, 'Emergency Contact Name'),
        validatePhoneNumber(formData.emergencyContactNumber),
        !formData.idFile ? 'Please upload your ID file.' : null,
    ];

    const firstError = validations.find(error => error !== null);
    if (firstError) {
        formData.setValidationError(firstError);
        return;
    }

    const fullName = `${formData.firstName} ${formData.lastName}`;
    const address = `${formData.street}, ${formData.barangay}, ${formData.city}, ${formData.province}, ${formData.country}`

    try {
        // Create the user
        const userResponse = await account.create(ID.unique(), formData.email, formData.password, fullName);
        const accountId = userResponse.$id;

        // Log in the user immediately after creating the account
        await account.createEmailPasswordSession(formData.email, formData.password);
        console.log('User logged in successfully.');

        // Generate JWT after account creation
        const jwtToken: any = await createJWT();
        console.log('JWT created:', jwtToken);

        // Store JWT in an HTTP-only cookie
        document.cookie = `jwtToken=${jwtToken}; Secure; HttpOnly; SameSite=Strict`;
        console.log('JWT stored');

        const accountData = {
            ...formData,
            userId: accountId,
            fullName: `${formData.firstName} ${formData.lastName}`,
            username: `${formData.firstName} ${formData.lastName}`,
            role: 'client',
        };

        // Create the user in the "Accounts" collection
        await databases.createDocument('Butterfly-Database', 'Accounts', accountId, {
            username: accountData.username,
            email: formData.email,
            role: accountData.role,
        });

        console.log('Accounts Collection document added');

        // Create the user in the "Client" collection
        const clientData = {
            userid: accountId,
            firstname: formData.firstName,
            lastname: formData.lastName,
            phonenum: formData.contactNumber,
            birthdate: formData.birthday,
            age: formData.age,
            address,
            type: 'minor',
            emergencyContactName: formData.emergencyContactName,
            emergencyContact: formData.emergencyContactNumber,
            state: null,
            status: null
        };

        await databases.createDocument('Butterfly-Database', 'Client', 'unique()', clientData);
        console.log('Client Collection document added');

        // Redirect or perform further actions after successful login and JWT creation
        formData.onRegister({ ...accountData, userId: accountId });

    } catch (error: any) {
        console.error('Error during registration:', error);
        let errorMessage;
    
        // Customize error message for 409 Conflict
        if (error.code === 409) {
            errorMessage = 'Duplicate User detected.';
        } else {
            errorMessage = error.message || 'An error occurred during registration.';
        }
    
        formData.setValidationError(errorMessage);
    }
};


// Wrapper function to use in the component
export const createSubmitHandler = (formData: FormData) => {
    return (e: React.FormEvent<HTMLFormElement>) => handleSubmit(e, formData);
};
