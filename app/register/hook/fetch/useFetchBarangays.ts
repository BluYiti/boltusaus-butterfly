import { useEffect } from 'react';

export const useFetchBarangays = (city: string, cities: any[], setBarangays: React.Dispatch<React.SetStateAction<any[]>>) => {
    useEffect(() => {
        const fetchBarangays = async () => {
            if (city) {
                const selectedCity = cities.find(c => c.name === city);
                if (selectedCity) {
                    try {
                        const response = await fetch(`https://psgc.gitlab.io/api/cities/${selectedCity.code}/barangays/`);
                        const data = await response.json();
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
