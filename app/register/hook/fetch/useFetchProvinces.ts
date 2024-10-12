'use client'

import { useEffect } from 'react';

export const useFetchProvinces = (selectedRegionCode: string, setProvinces: React.Dispatch<React.SetStateAction<any[]>>) => {
    useEffect(() => {
        const fetchProvinces = async () => {
            if (selectedRegionCode) {
                try {
                    const response = await fetch(`https://psgc.gitlab.io/api/regions/${selectedRegionCode}/provinces/`);
                    const data = await response.json();
                    setProvinces(data);
                } catch (error) {
                    console.error('Error fetching province data:', error);
                }
            } else {
                setProvinces([]);
            }
        };

        fetchProvinces();
    }, [selectedRegionCode, setProvinces]);
};
