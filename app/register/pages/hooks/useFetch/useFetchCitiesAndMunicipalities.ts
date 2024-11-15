import { useEffect } from 'react';

interface City {
    name: string;
    code: string;
}

interface Province {
    name: string;
    code: string;
}

interface Barangay {
    name: string;
}

export const useFetchCities = (
    province: string, 
    provinces: Province[], 
    setCities: React.Dispatch<React.SetStateAction<City[]>>, 
    setCity: React.Dispatch<React.SetStateAction<string>>, 
    setBarangays: React.Dispatch<React.SetStateAction<Barangay[]>>
) => {
    useEffect(() => {
        const fetchCities = async () => {
            if (province) {
                const selectedProvince = provinces.find(p => p.name === province);
                if (selectedProvince) {
                    try {
                        const response = await fetch(`https://psgc.gitlab.io/api/provinces/${selectedProvince.code}/cities-municipalities/`);
                        const data: City[] = await response.json();  // Define the type here
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
