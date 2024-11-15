import { useEffect } from 'react';

interface Region {
    code: string;
    name: string;
}

export const useFetchRegions = (setRegions: React.Dispatch<React.SetStateAction<Region[]>>) => {
    useEffect(() => {
        const fetchRegions = async () => {
            try {
                const response = await fetch('https://psgc.gitlab.io/api/regions/');
                const data: Region[] = await response.json();  // Define the type here
                setRegions(data);
            } catch (error) {
                console.error('Error fetching region data:', error);
            }
        };

        fetchRegions();
    }, [setRegions]);
};
