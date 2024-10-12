'use client';

import { client, account, databases } from '@/appwrite';
import { Users } from 'node-appwrite'; // Import Client and Users directly
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

const users = new Users(client);

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, formData: FormData) => {
    e.preventDefault();
    formData.setValidationError(null);

    console.log('Email being used for registration:', formData.email);

    // Validate fields
    const validations = [
        validateName(formData.firstName, 'First Name'),
        validateName(formData.lastName, 'Last Name'),
        formData.birthday ? null : 'Birthday is required.',
        formData.age !== null && formData.age < 18 ? 'You must be at least 18 years old to register.' : null,
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
        const userResponse = await account.create('unique()', formData.email, formData.password, fullName);
        
        const accountId = userResponse.$id; // Get user ID
        const accountData = {
            ...formData,
            userId: accountId,
            fullName,
            username: fullName,
            role: 'client',
        };

        // Create a new document in the Accounts collection
        await databases.createDocument('Butterfly-Database', 'Accounts', accountId, {
            username: accountData.username,
            email: formData.email,
            role: accountData.role,
        });
        
        console.log('User and account created successfully');

        // Now create a client document in the Client collection
        const clientData = {
            userid: accountId,
            firstname: formData.firstName,
            lastname: formData.lastName,
            phonenum: formData.contactNumber,
            birthdate: formData.birthday,
            age: formData.age,
            address: address,
            type: 'adult',
            emergencyContactName: formData.emergencyContactName,
            state: null,
            emergencyContact: formData.emergencyContactNumber,
            status: null
        };

        await databases.createDocument('Butterfly-Database', 'Client','unique()', clientData);
        
        console.log('Client document created successfully:', clientData);
        
        formData.onRegister(accountData); // Call the onRegister handler with the account data

    } catch (error) {
        console.error('Error during registration:', error);
        formData.setValidationError('An error occurred during registration');
    }
};

// Wrapper function to use in the component
export const createSubmitHandler = (formData: FormData) => {
    return (e: React.FormEvent<HTMLFormElement>) => handleSubmit(e, formData);
};