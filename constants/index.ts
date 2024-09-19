export const SexOptions = ["Male", "Female"];

export const RegisterFormDefaultValues = {
  firstName: "",
  lastName: "",
  middleName: "",
  suffixName: "",
  email: "",
  phone: "",
  birthDate: new Date(Date.now() - 315360000000),
  sex: "Male" as Sex,
  nationality: "",
  civilStatus: "",
  address: "",
  barangay: "",
  city: "",
  province: "",
  occupation: "",
  emergencyContactName: "",
  emergencyContactNumber: "",
  allergies: "",
  currentMedications: "",
  familyMedicalHistory: "",
  pastMedicalHistory: "",
  identificationType: "Birth Certificate",
  identificationNumber: "",
  identificationDocument: [],
  therapyConsent: false,
  disclosureConsent: false,
  privacyConsent: false,
};

export const Psychotherapists = [
  {
    image: "/assets/images/am-peralta.png",
    name: "Angelica Peralta",
  },
];

export const IdentificationTypes = [
  "Birth Certificate",
  "Driver's License",
  "Medical Insurance Card/Policy",
  "Military ID Card",
  "National Identity Card",
  "Passport",
  "Resident Alien Card (Green Card)",
  "Social Security Card",
  "State ID Card",
  "Student ID Card",
  "Voter ID Card",
];

export const SuffixTypes = ["None", "Jr.", "Sr.", "III", "IV", "V"];

export const Provinces = ["Benguet"];

export const Nationality = ["Filipino"];

export const CivilStatus = [
  "Single",
  "Married",
  "Annulled",
  "Divorced",
  "Widowed",
];

export const ConsultationType = ["Face to Face", "Online"];

export const StatusIcon = {
  scheduled: "/assets/icons/check.svg",
  pending: "/assets/icons/pending.svg",
  cancelled: "/assets/icons/cancelled.svg",
};
