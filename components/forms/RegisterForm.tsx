"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { SelectItem } from "@/components/ui/select";
import { Form, FormControl } from "@/components/ui/form";
import { registerClient } from "@/lib/actions/client.actions";
import { RegisterFormValidation } from "@/lib/validation";

import { CustomFormField } from "../CustomFormField";
import { FormFieldType } from "./SignUpForm";
import FileUploader from "../FileUploader";
import SubmitButton from "../SubmitButton";

import {
  SexOptions,
  IdentificationTypes,
  RegisterFormDefaultValues,
  SuffixTypes,
  Nationality,
  CivilStatusOptions,
} from "@/constants";

const RegisterForm = ({ user }: { user: User }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof RegisterFormValidation>>({
    resolver: zodResolver(RegisterFormValidation),
    defaultValues: {
      ...RegisterFormDefaultValues,
    },
  });

  // Submit handler: Do something with the form values.
  async function onSubmit(values: z.infer<typeof RegisterFormValidation>) {
    // ✅ This will be type-safe and validated.
    setIsLoading(true);

    let formData;

    if (
      values.identificationDocument &&
      values.identificationDocument.length > 0
    ) {
      const blobFile = new Blob([values.identificationDocument[0]], {
        type: values.identificationDocument[0].type,
      });

      formData = new FormData();
      formData.append("blobFile", blobFile);
      formData.append("fileName", values.identificationDocument[0].name);
    }

    try {
      const clientData = {
        ...values,
        userId: user.$id,
        birthDate: new Date(values.birthDate),
        identificationDocument: formData,
      };

      // @ts-ignore
      const client = await registerClient(clientData);

      if (client) router.push(`/client/${user.$id}/dashboard`);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex-1 space-y-12"
      >
        <section className="space-y-4">
          <h1 className="header">Fill up the form</h1>
          <p className="text-dark-600">
            Thank you for choosing A.M. Peralta Psychological Services. Filling
            in the required information is necessary for our Psychologist and
            Psychotherapist to have a well-directed clinical interview with you.
          </p>
        </section>

        <section className="space-y-6">
          <div className="mb-1 space-y-1">
            <h2 className="sub-header">Personal Information</h2>
          </div>
        </section>

        {/* Full Name */}
        <div className="grid grid-cols-2 xl:grid-cols-2 gap-2">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="lastName"
            label={
              <span>
                Last Name (<i>Apeliyido</i>)
              </span>
            }
            placeholder="Last Name"
            className="w-full xl:w-1/2"
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="firstName"
            label={
              <span>
                First Name (<i>Pangalan</i>)
              </span>
            }
            placeholder="First Name"
            className="w-full xl:w-1/2"
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="middleName"
            label={
              <span>
                Middle Name (<i>Panggitnang apelyido</i>)
              </span>
            }
            placeholder="Middle Name"
            className="w-full xl:w-1/4"
          />
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="suffixName"
            label="Suffix"
            placeholder="Select Suffix"
            className="w-full xl:w-1/8"
          >
            {SuffixTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </CustomFormField>
          <CustomFormField
            fieldType={FormFieldType.DATE_PICKER}
            control={form.control}
            name="birthDate"
            label={
              <span>
                Date of Birth (<i>Petsa ng kapanganakan</i>)
              </span>
            }
            className="w-full"
          />
          <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="sex"
            label={
              <span>
                Sex (<i>Kasarian</i>)
              </span>
            }
            renderSkeleton={(field) => (
              <FormControl>
                <RadioGroup
                  className="flex h-11 gap-4 xl:justify-between"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  {SexOptions.map((option) => (
                    <div key={option} className="radio-group">
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option} className="cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
            )}
            className="w-full"
          />
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="nationality"
            label={
              <span>
                Nationality (<i>Nasyonalidad</i>)
              </span>
            }
            placeholder="Select Nationality"
          >
            {Nationality.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </CustomFormField>
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="civilStatus"
            label={
              <span>
                Civil Status (<i>Estado</i>)
              </span>
            }
            placeholder="Select Civil Status"
          >
            {CivilStatusOptions.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </CustomFormField>
        </div>

        <section className="space-y-6">
          <div className="mb-4 space-y-1">
            <h2 className="sub-header">Contact Information</h2>
          </div>
        </section>

        {/* Email and Phone */}
        <div className="flex gap-4 xl:flex-nowrap">
          <div className="flex-1">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="email"
              label="Email"
              placeholder="butterfly@butterfly.com"
              iconSrc="/assets/icons/email.svg"
              iconAlt="email"
            />

            <CustomFormField
              fieldType={FormFieldType.PHONE_INPUT}
              control={form.control}
              name="phone"
              label="Phone Number"
            />
          </div>
        </div>

        <section className="space-y-6">
          <div className="mb-4 space-y-1">
            <h2 className="sub-header">Demographic Information</h2>
          </div>
        </section>

        {/* Address*/}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="occupation"
            label="Occupation"
            placeholder="Occupation"
            iconSrc="/assets/icons/occupation.svg"
            iconAlt="occupation"
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="address"
            label={
              <span>
                Home Address (<i>Address ng Tahanan</i>)
              </span>
            }
            placeholder="Street Name, Building, House No."
            iconSrc="/assets/icons/home.svg"
            iconAlt="address"
          />
        </div>

        <section className="space-y-6">
          <div className="mb-4 space-y-1">
            <h2 className="sub-header">Emergency Contact Information</h2>
          </div>
        </section>

        {/* Emergency Contact */}
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="emergencyContactName"
            label="Person to Contact in Case of Emergency"
            placeholder="Name of emergency contact"
            iconSrc="/assets/icons/phone.svg"
            iconAlt="phone"
          />
          <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="emergencyContactNumber"
            label="Emergency Contact Number"
          />
        </div>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Medical Information</h2>
          </div>
        </section>

        {/* Seeking Therapy Reason, Medications, and Medical History*/}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="therapyReason"
            label="Reason for seeking therapy?"
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="currentMedication"
            label="Current Medications (if any)"
          />
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="familyMedicalHistory"
            label="Family Medical History"
          />
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="pastMedicalHistory"
            label="Your Past Medical History"
          />
        </div>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Identification and Verification</h2>
          </div>
        </section>

        {/* Identification Type, Number, and Upload */}
        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="identificationType"
          label="Identification Type"
          placeholder="Select an Identification Type"
        >
          {IdentificationTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </CustomFormField>

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="identificationNumber"
          label="Identification Number"
        />

        <CustomFormField
          fieldType={FormFieldType.SKELETON}
          control={form.control}
          name="identificationDocument"
          label="Identification Document"
          renderSkeleton={(field) => (
            <FormControl>
              <FileUploader files={field.value} onChange={field.onChange} />
            </FormControl>
          )}
        />

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Consent and Privacy</h2>
          </div>
        </section>

        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="therapyConsent"
          label="I consent to participate in online psychotherapy sessions with a licensed therapist, which may include discussion of my mental health, personal experiences, and other sensitive topics."
        />
        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="disclosureConsent"
          label="I consent to the disclosure of my personal and health information to my therapist and other authorized personnel for the purpose of providing online psychotherapy services, in accordance with applicable laws and regulations."
        />
        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="privacyConsent"
          label="I acknowledge that I have reviewed and agree to the Privacy Policy, which explains how my personal data will be collected, used, and protected, including my rights to access, correct, and delete my data."
        />

        <SubmitButton isLoading={isLoading}>Register</SubmitButton>
      </form>
    </Form>
  );
};

export default RegisterForm;