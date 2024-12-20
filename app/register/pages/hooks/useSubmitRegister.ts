'use client';

import { account, databases, createJWT, storage, ID } from '@/appwrite';
import React from 'react';
import { FormData } from '@/register/pages/components/RegisterFormProps';

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

const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>, 
    formData: FormData, 
    setLoading: (loading: boolean) => void, 
    setButtonClicked: (clicked: boolean) => void
) => {
    e.preventDefault();
    formData.setValidationError(null);

    setLoading(true); // Set loading to true when submit starts
    setButtonClicked(true); // Show the button as clicked

    // Validate fields
    const validations = [
        validateName(formData.firstName, 'First Name'),
        validateName(formData.lastName, 'Last Name'),
        formData.birthday ? null : 'Birthday is required.',
        formData.sex ? null : 'Sex is required.',
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
        validateFile(formData.idFile),
        !formData.idFile ? 'Please upload your ID file.' : null,
    ];

    const firstError = validations.find(error => error !== null);
    if (firstError) {
        formData.setValidationError(firstError);
        return;
    }

    try {
        // Check if the user is authenticated before checking session
        const currentSession = await account.getSession('current').catch(() => {
            console.log('No active session found or user is not authenticated');
            return null; // Skip if no session is found
        });
    
        if (currentSession) {
            await account.deleteSession(currentSession.$id);
            console.log(`Session ${currentSession.$id} deleted.`);
        } else {
            console.log('No active session found.');
        }
    
        const fullName = `${formData.firstName} ${formData.lastName}`;
        const address = `${formData.street}, ${formData.barangay}, ${formData.city}, ${formData.province}, ${formData.country}`;
    
        // Create the user
        const userResponse = await account.create(ID.unique(), formData.email, formData.password, fullName);
        const accountId = userResponse.$id;
    
        // Log in the user immediately after creating the account
        await account.createEmailPasswordSession(formData.email, formData.password);
        console.log('User logged in successfully.');
    
        const jwtToken = await createJWT();
        console.log('JWT created:', jwtToken);
    
        // Store JWT in an HTTP-only cookie
        document.cookie = `jwtToken=${jwtToken}; Secure; HttpOnly; SameSite=Strict`;
        console.log('JWT stored');
    
        // Upload the ID file to Appwrite
        const bucketId = 'Images'; // Replace with your Appwrite bucket ID
        const fileUpload = await storage.createFile(bucketId, ID.unique(), formData.idFile);
        const fileId = fileUpload.$id;
    
        // Create account data and client data
        const accountData = {
            ...formData,
            userId: accountId,
            fullName,
            username: fullName,
            role: 'client',
        };
    
        await databases.createDocument('Butterfly-Database', 'Accounts', accountId, {
            username: accountData.username,
            email: formData.email,
            role: accountData.role,
        });
        console.log('Accounts Collection document added');
    
        const clientData = {
            userid: accountId,
            firstname: formData.firstName,
            lastname: formData.lastName,
            phonenum: formData.contactNumber,
            birthdate: formData.birthday,
            age: formData.age,
            address,
            type: 'adult',
            emergencyContactName: formData.emergencyContactName,
            emergencyContact: formData.emergencyContactNumber,
            state: 'new',
            sex: formData.sex,
            idFile: fileId,
            psychotherapist: null,
            certificate: null,
            status: null,
            allowTherapistChange: true
        };
    
        await databases.createDocument('Butterfly-Database', 'Client', 'unique()', clientData);
        console.log('Client Collection document added');
    
        // Redirect or perform further actions after successful login and JWT creation
        formData.onRegister({ ...accountData, userId: accountId });
    
    } catch (error) {
        console.error('Error during registration:', error);
        let errorMessage;
    
        if (error.code === 409) {
            errorMessage = 'Email is already in use';
        } else if (error.message.includes('Network Error')) {
            errorMessage = 'Network error. Please check your internet connection.';
        } else if (error.code === 500) {
            errorMessage = 'Server error. Please try again later.';
        } else {
            errorMessage = error.message || 'An error occurred during registration.';
        }
    
        formData.setValidationError(errorMessage);
    
        // Reset loading and button clicked states when an error occurs
        setLoading(false);
        setButtonClicked(false);
    }
    
};


// Updated wrapper function to pass setLoading and setButtonClicked
export const createSubmitHandler = (
    formData: FormData, 
    setLoading: (loading: boolean) => void, 
    setButtonClicked: (clicked: boolean) => void
) => {
    return (e: React.FormEvent<HTMLFormElement>) => handleSubmit(e, formData, setLoading, setButtonClicked);
};