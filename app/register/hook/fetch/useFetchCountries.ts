import { useEffect } from 'react';

export const useFetchCountries = (setCountries: React.Dispatch<React.SetStateAction<any[]>>) => {
    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await fetch('https://restcountries.com/v3.1/all?fields=name,flags');
                const data = await response.json();
                setCountries(data);
            } catch (error) {
                console.error('Error fetching country data:', error);
            }
        };

        fetchCountries();
    }, [setCountries]);
};
