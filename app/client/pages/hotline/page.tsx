"use client"; // Add this at the top to mark it as a Client Component

import React from 'react';
import Layout from '@/components/Sidebar/Layout';
import items from '@/client/data/Links';
import useAuthCheck from '@/auth/page';
import LoadingScreen from '@/components/LoadingScreen';

const HotlinePage = () => {
    const authLoading = useAuthCheck(['client']); // Call the useAuthCheck hook

    if (authLoading ) {
        return <LoadingScreen />; // Show the loading screen while the auth check or data loading is in progress
    }
    return (
        <Layout sidebarTitle="Butterfly" sidebarItems={items}>
            <div 
                className="min-h-screen p-8 bg-cover bg-center"
                style={{ backgroundImage: "url('/images/contact.jpeg')" }} // Update the path to your image
            >
                <div className="bg-white shadow-lg rounded-xl p-7 mb-8 border border-blue-200">
                    <h2 className="text-4xl font-bold text-blue-500 mb-4">Emergency Hotline Numbers</h2>
                    <p className="text-gray-600 text-lg">
                        If you are in need of immediate help, or if someone else may be in danger, the following resources can provide assistance.
                    </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Philippines</h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li><strong>Emergency:</strong> 911</li>
                        <li><strong>Suicide Hotline:</strong> 028969191</li>
                        <li><strong>DOH Mental Health Crisis Hotline:</strong> 632-8651-7800</li>
                        <li><strong>Emergency 911 National Office:</strong> 02-925-9111</li>
                        <li><strong>HopeLine Philippines:</strong> 02-804-4673</li>
                        <li><strong>In Touch Crisis Line:</strong> 63-2-8893-7603</li>
                        <li><strong>NCMH Crisis Hotline:</strong> 0917-899-8727 (USAP), 989-8727 (USAP)</li>
                        <li><strong>PMHA Hotline:</strong> 0917-899-8727 (USAP)</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-4">Baguio City</h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li><strong>Baguio Police Station:</strong> 166</li>
                        <li><strong>Directory Assistance:</strong> 114</li>
                        <li><strong>Baguio General Hospital:</strong> 442-4216 or 169</li>
                        <li><strong>Baguio Medical Center:</strong> 442-3338 or 442-2626</li>
                        <li><strong>BGHMC E.R:</strong> 442-3765</li>
                        <li><strong>BGH STOP DEATH program:</strong> 443-5678</li>
                        <li><strong>Emergency Medical Services:</strong> 442-1911</li>
                    </ul>
                </div>
            </div>
        </Layout>
    );
};

export default HotlinePage;
