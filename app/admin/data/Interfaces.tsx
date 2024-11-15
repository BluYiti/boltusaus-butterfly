export interface User {
    username: string;
    $id: string;
    id: string; // Assuming user ID is a string, adjust as needed
    name: string;
    email: string;
    phonenum: string;
    role: string;
}

export interface Accounts {
    username: string;
    email: string;
    role: string;
}

export interface Client {
    userId: string;
    firstname: string;
    lastname: string;
    phonenum: string;
    birthdate: Date;
    age: string;
    address: string;
    type: string;
    emergencyContactName: string;
    state: string;
    emergencyContact: string;
    status: string;
    sex: string;
}

export interface Associate {
    userId: string;
    firstname: string;
    lastname: string;
}

export interface Psychotherapist {
    userId: string;
    firstname: string;
    lastname: string;
}