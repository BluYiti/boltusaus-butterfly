/* eslint-disable no-unused-vars */

declare type SearchParamProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

declare type Sex = "Male" | "Female";
declare type Status = "pending" | "scheduled" | "cancelled";

declare interface SignUpUserParams {
  firstName: string;
  email: string;
  phone: string;
}

declare interface User extends SignUpUserParams {
  $id: string;
}

declare interface RegisterUserParams extends SignUpUserParams {
  userId: string;
  lastName: string;
  firstName: string;
  middleName: string | undefined;
  suffixName: string | undefined;
  birthDate: Date;
  sex: Sex;
  nationality: string;
  civilStatus: string;
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

declare interface LoginUserParams extends RegisterUserParams {
  username: string;
  password: string;
}

declare type CreateAppointmentParams = {
  userId: string;
  client: string;
  primaryPsychotherapist: string;
  schedule: Date;
  consultationType: string;
  reason: string;
  consultationNotes: string | undefined;
  status: Status;
};

declare type UpdateAppointmentParams = {
  appointmentId: string;
  userId: string;
  timeZone: string;
  appointment: Appointment;
  type: string;
};
