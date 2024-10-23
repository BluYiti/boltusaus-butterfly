'use client'

import { useEffect } from 'react';

export const useFetchCities = (province: string, provinces: any[], setCities: React.Dispatch<React.SetStateAction<any[]>>, setCity: React.Dispatch<React.SetStateAction<string>>, setBarangays: React.Dispatch<React.SetStateAction<any[]>>) => {
    useEffect(() => {
        const fetchCities = async () => {
            if (province) {
                const selectedProvince = provinces.find(p => p.name === province);
                if (selectedProvince) {
                    try {
                        const response = await fetch(`https://psgc.gitlab.io/api/provinces/${selectedProvince.code}/cities-municipalities/`);
                        const data = await response.json();
                        setCities(data);
                        setCity('');
                        setBarangays([]);
                    } catch (error) {
                        console.error('Error fetching city data:', error);
                    }
                }
            } else {
                setCities([]);
            }
        };

        fetchCities();
    }, [province, provinces, setCities, setCity, setBarangays]);
};
