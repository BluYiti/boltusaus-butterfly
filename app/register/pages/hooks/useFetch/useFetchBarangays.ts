import { useEffect } from 'react';

interface Barangay {
    name: string;
}

interface City {
    name: string;
    code: string;
}

export const useFetchBarangays = (city: string, cities: City[], setBarangays: React.Dispatch<React.SetStateAction<Barangay[]>>) => {
    useEffect(() => {
        const fetchBarangays = async () => {
            if (city) {
                const selectedCity = cities.find(c => c.name === city);
                if (selectedCity) {
                    try {
                        const response = await fetch(`https://psgc.gitlab.io/api/cities-municipalities/${selectedCity.code}/barangays/`);
                        const data: Barangay[] = await response.json();  // Define the type here
                        setBarangays(data);
                    } catch (error) {
                        console.error('Error fetching barangay data:', error);
                    }
                }
            } else {
                setBarangays([]);
            }
        };

        fetchBarangays();
    }, [city, cities, setBarangays]);
};
