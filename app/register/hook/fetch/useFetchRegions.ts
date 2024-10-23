'use client'

import { useEffect } from 'react';

export const useFetchRegions = (setRegions: React.Dispatch<React.SetStateAction<any[]>>) => {
    useEffect(() => {
        const fetchRegions = async () => {
            try {
                const response = await fetch('https://psgc.gitlab.io/api/regions/');
                const data = await response.json();
                setRegions(data);
            } catch (error) {
                console.error('Error fetching region data:', error);
            }
        };

        fetchRegions();
    }, [setRegions]);
};
