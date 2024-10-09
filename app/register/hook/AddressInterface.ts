export interface Country {
    name: {
        common: string;
    };
    flags: {
        png: string;
    };
}

export interface Region {
    code: string;
    name: string;
}

export interface Province {
    code: string;
    name: string;
    region: string;
}

export interface City {
    code: string;
    name: string;
    province: string;
}

export interface Barangay {
    code: string;
    name: string;
    city: string; // Assuming there’s a city code to filter by
}
