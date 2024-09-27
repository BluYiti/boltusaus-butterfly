import { z } from "zod";

export const LoginFormValidation = z.object({
  username: z.string().min(2, "Please enter your username"),
  password: z.string().min(2, "Please enter your password"),
});

export const SignUpFormValidation = z.object({
  firstName: z
    .string()
    .min(5, "Name must be at least 5 characters")
    .max(50, "Name must be at most 50 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .refine((phone) => /^\+\d{10,15}$/.test(phone), "Invalid phone number"),
});

export const RegisterFormValidation = z.object({
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be at most 50 characters"),
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be at most 50 characters"),
  middleName: z.string().optional(),
  suffixName: z.string().min(1, "Select 'None' if no suffix name"),
  birthDate: z.coerce.date(),
  sex: z.enum(["Male", "Female"]),
  nationality: z.string().min(1, "Select a Nationality"),
  civilStatus: z.string().min(1, "Select a Civil Status"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .refine((phone) => /^\+\d{10,15}$/.test(phone), "Invalid phone number"),
  occupation: z
    .string()
    .min(2, "Occupation must be at least 2 characters")
    .max(500, "Occupation must be at most 500 characters"),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(500, "Address must be at most 500 characters"),
  emergencyContactName: z
    .string()
    .min(2, "Contact name must be at least 2 characters")
    .max(50, "Contact name must be at most 50 characters"),
  emergencyContactNumber: z
    .string()
    .refine(
      (emergencyContactNumber) => /^\+\d{10,15}$/.test(emergencyContactNumber),
      "Invalid emergency contact number"
    ),
  therapyReason: z.string().optional(),
  currentMedication: z.string().optional(),
  familyMedicalHistory: z.string().optional(),
  pastMedicalHistory: z.string().optional(),
  identificationType: z.string().optional(),
  identificationNumber: z.string().optional(),
  identificationDocument: z.custom<File[]>().optional(),
  therapyConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "You must consent to therapy in order to proceed",
    }),
  disclosureConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "You must consent to disclosure in order to proceed",
    }),
  privacyConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "You must consent to privacy in order to proceed",
    }),
});

export const AppointmentFormValidation = z.object({});

export const CreateAppointmentSchema = z.object({
  primaryPsychotherapist: z
    .string()
    .min(2, "Select at least one psychotherapist"),
  schedule: z.coerce.date(),
  consultationType: z.string().min(2, "Select a Consultation Type"),
  reason: z
    .string()
    .min(2, "Reason must be at least 2 characters")
    .max(500, "Reason must be at most 500 characters"),
  consultationNotes: z.string().optional(),
  cancellationReason: z.string().optional(),
});

export const ScheduleAppointmentSchema = z.object({
  primaryPsychotherapist: z
    .string()
    .min(2, "Select at least one psychotherapist"),
  schedule: z.coerce.date(),
  consultationType: z.string().min(2, "Select a Consultation Type"),
  reason: z.string().optional(),
  consultationNotes: z.string().optional(),
  cancellationReason: z.string().optional(),
});

export const CancelAppointmentSchema = z.object({
  primaryPsychotherapist: z
    .string()
    .min(2, "Select at least one psychotherapist"),
  consultationType: z.string().min(2, "Select a Consultation Type"),
  schedule: z.coerce.date(),
  reason: z.string().optional(),
  consultationNotes: z.string().optional(),
  cancellationReason: z
    .string()
    .min(2, "Reason must be at least 2 characters")
    .max(500, "Reason must be at most 500 characters"),
});

export function getAppointmentSchema(type: string) {
  switch (type) {
    case "create":
      return CreateAppointmentSchema;
    case "cancel":
      return CancelAppointmentSchema;
    default:
      return ScheduleAppointmentSchema;
  }
}
