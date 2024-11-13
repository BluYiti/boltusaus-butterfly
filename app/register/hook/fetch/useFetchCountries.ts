import { useEffect } from 'react';

interface Country {
    name: {
        common: string;
    };
    flags: {
        png: string;
    };
}

export const useFetchCountries = (setCountries: React.Dispatch<React.SetStateAction<Country[]>>) => {
    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await fetch('https://restcountries.com/v3.1/all?fields=name,flags');
                const data: Country[] = await response.json();  // Define the type here
                setCountries(data);
            } catch (error) {
                console.error('Error fetching country data:', error);
            }
        };

        fetchCountries();
    }, [setCountries]);
};
