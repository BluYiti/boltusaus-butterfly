import { useEffect } from 'react';

interface Province {
    name: string;
    code: string;
}

export const useFetchProvinces = (selectedRegionCode: string, setProvinces: React.Dispatch<React.SetStateAction<Province[]>>) => {
    useEffect(() => {
        const fetchProvinces = async () => {
            if (selectedRegionCode) {
                try {
                    const response = await fetch(`https://psgc.gitlab.io/api/regions/${selectedRegionCode}/provinces/`);
                    const data: Province[] = await response.json();  // Define the type here
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
