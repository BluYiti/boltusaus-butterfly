import { Models } from "node-appwrite";

export interface Client extends Models.Document {
  userId: string;
  username: string;
  password: string;
  lastName: string;
  firstName: string;
  middleName: string;
  suffixName: string;
  birthDate: Date;
  sex: Sex;
  nationality: string;
  civilStatus: string;
  email: string;
  phone: string;
  occupation: string;
  address: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  currentMedication: string | undefined;
  familyMedicalHistory: string | undefined;
  pastMedicalHistory: string | undefined;
  identificationType: string | undefined;
  identificationNumber: string | undefined;
  identificationDocument: FormData | undefined;
  therapyConsent: boolean;
  disclosureConsent: boolean;
  privacyConsent: boolean;
}

export interface Associate extends Models.Document {}

export interface Appointment extends Models.Document {
  userId: string;
  client: Client;
  primaryPsychotherapist: string;
  schedule: Date;
  consultationType: string;
  reason: string;
  consultationNotes: string | null;
  cancellationReason: string | null;
  status: Status;
}
