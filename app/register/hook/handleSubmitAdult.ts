'use client';

import { account, databases, createJWT, ID, storage } from '@/appwrite';
import React from 'react';

// FormData interface to define the shape of the form data
interface FormData {
    firstName: string;
    lastName: string;
    birthday: string;
    sex: string;
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
    userId?: string;
    onRegister: (data: FormData) => void;
    setValidationError: (error: string | null) => void;
}

// FormFieldSetters interface to define types for each setter function
interface FormFieldSetters {
    firstName: (value: string) => void;
    lastName: (value: string) => void;
    birthday: (value: string) => void;
    sex: (value: string) => void;
    password: (value: string) => void;
    rePassword: (value: string) => void;
    age: (value: number | null) => void;
    street: (value: string) => void;
    barangay: (value: string) => void;
    city: (value: string) => void;
    province: (value: string) => void;
    country: (value: string) => void;
    contactNumber: (value: string) => void;
    emergencyContactName: (value: string) => void;
    emergencyContactNumber: (value: string) => void;
    idFile: (value: File | null) => void;
    email: (value: string) => void;
}

// ResetFormFunction type to reset form fields
type ResetFormFunction = (errors: string[], setters: FormFieldSetters) => void;

// Function to validate email format
const validateEmail = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email) ? null : 'Please enter a valid email address.';
};

// Function to validate phone number format
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

// Modular function to validate all fields
const handleValidation = (formData: FormData) => {
    const errors: string[] = [];
    
    if (!formData.firstName.trim()) errors.push('First Name is required.');
    if (!formData.lastName.trim()) errors.push('Last Name is required.');
    if (!formData.birthday) errors.push('Birthday is required.');
    if (!formData.sex) errors.push('Sex is required.');
    if (formData.age !== null && formData.age > 18) errors.push('Only adults are allowed to register here.');
    if (formData.password.length < 8) errors.push('Password must be at least 8 characters long.');
    if (formData.rePassword.length < 8) errors.push('Re-enter Password must be at least 8 characters long.');
    if (formData.password !== formData.rePassword) errors.push('Passwords do not match.');
    if (!formData.agreeToTerms) errors.push('You must agree to the terms and conditions before registering.');
    if (!formData.street.trim()) errors.push('Street is required.');
    if (!formData.barangay.trim()) errors.push('Barangay is required.');
    if (!formData.city.trim()) errors.push('City is required.');
    if (!formData.province.trim()) errors.push('Province is required.');
    if (!formData.country.trim()) errors.push('Country is required.');
    if (!validateEmail(formData.email)) errors.push('Please enter a valid email address.');
    if (!validatePhoneNumber(formData.contactNumber)) errors.push('Please enter a valid contact number.');
    if (!validatePhoneNumber(formData.emergencyContactNumber)) errors.push('Please enter a valid emergency contact number.');
    const fileError = validateFile(formData.idFile);
    if (fileError) errors.push(fileError);
    
    return errors;
};

// Handle the form submission and logic
const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>, 
    formData: FormData, 
    setLoading: (loading: boolean) => void, 
    setButtonClicked: (clicked: boolean) => void,
    resetForm: ResetFormFunction,  // Reset function with proper typing
    setters: FormFieldSetters // Setters for form fields
) => {
    e.preventDefault();
    formData.setValidationError(null);

    setLoading(true); // Set loading to true when submit starts
    setButtonClicked(true); // Show the button as clicked

    console.log('Email being used for registration:', formData.email);

    // Validate fields
    const errors = handleValidation(formData);
    if (errors.length > 0) {
        formData.setValidationError(errors.join(' '));  // Display all errors as a string
        resetForm(errors, setters); // Reset the relevant fields
        return;
    }

    try {
        // Check if the user is currently logged in by trying to fetch the active session
        const currentSession = await account.getSession('current');
        if (currentSession) {
            console.log('Logging out the current session...');
            await account.deleteSessions(); // Log out the current session
        }

        const fullName = `${formData.firstName} ${formData.lastName}`;
        const address = `${formData.street}, ${formData.barangay}, ${formData.city}, ${formData.province}, ${formData.country}`;

        // Create the user
        const userResponse = await account.create(ID.unique(), formData.email, formData.password, fullName);
        const accountId = userResponse.$id;

        // Log in the user immediately after creating the account
        await account.createEmailPasswordSession(formData.email, formData.password);
        console.log('User logged in successfully.');

        // Generate JWT after account creation
        const jwtToken: string = await createJWT();
        console.log('JWT created:', jwtToken);

        // Store JWT in an HTTP-only cookie
        document.cookie = `jwtToken=${jwtToken}; Secure; HttpOnly; SameSite=Strict`;
        console.log('JWT stored');

        // Upload the ID file to Appwrite   
        const bucketId = 'Images'; // Replace with your Appwrite bucket ID
        const fileUpload = await storage.createFile(bucketId, ID.unique(), formData.idFile);

        // Retrieve the file ID after uploading
        const fileId = fileUpload.$id;

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

        // Customize error message for 409 Conflict
        if (error.code === 409) {
            errorMessage = 'Duplicate User detected.';
            await account.deleteSessions();
        } else {
            errorMessage = error.message || 'An error occurred during registration.';
            await account.deleteSessions();
        }

        formData.setValidationError(errorMessage);

        // Reset loading and button clicked states when an error occurs
        setLoading(false);
        setButtonClicked(false);
        resetForm([], setters); // Reset the form after an error
    }
};

// Wrapper function to pass setLoading, setButtonClicked, and resetForm
export const createSubmitHandler = (
    formData: FormData, 
    setLoading: (loading: boolean) => void, 
    setButtonClicked: (clicked: boolean) => void,
    resetForm: ResetFormFunction,
    setters: FormFieldSetters
) => {
    return (e: React.FormEvent<HTMLFormElement>) => handleSubmit(e, formData, setLoading, setButtonClicked, resetForm, setters);
};
