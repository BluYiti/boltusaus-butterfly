export interface RegisterFormProps {
    isAdult?: boolean;
    error: string | null;
}

export interface FormData {
    firstName: string;
    lastName: string;
    birthday: string;
    sex: string;
    password: string;
    rePassword: string;
    agreeToTerms: boolean;
    age: number | null;
    street: string;
    barangay: string;
    city: string;
    province: string;
    country: string;
    contactNumber: string;
    emergencyContactName: string;
    emergencyContactNumber: string;
    idFile: File | null;
    email: string;
    userId?: string; // Add userId to track user creation
    onRegister: (data: FormData) => void;
    setValidationError: (error: string | null) => void;
}

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