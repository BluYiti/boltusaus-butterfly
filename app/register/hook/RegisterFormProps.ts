export interface RegisterFormProps {
    onRegister: (data: {
        firstName: string;
        lastName: string;
        birthday: string;
        sex: string;
        address: string;
        contactNumber: string;
        emergencyContactName: string;
        emergencyContactNumber: string;
        idFile: File | null;
        email: string;
        password: string;
    }) => void;
    error: string | null;
    loading: boolean;
}