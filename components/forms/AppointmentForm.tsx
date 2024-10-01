"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import {
  createAppointment,
  updateAppointment,
} from "@/lib/actions/appointment.actions";
import { ConsultationType, Psychotherapists } from "@/constants";
import { Appointment } from "@/types/appwrite.types";
import { getAppointmentSchema } from "@/lib/validation";

import { CustomFormField } from "../CustomFormField";
import { FormFieldType } from "./SignUpForm";
import { SelectItem } from "../ui/select";
import SubmitButton from "../SubmitButton";
import Image from "next/image";

const AppointmentForm = ({
  userId,
  clientId,
  type,
  appointment,
  setOpen,
}: {
  userId: string;
  clientId: string;
  type: "create" | "cancel" | "schedule";
  appointment?: Appointment;
  setOpen: (open: boolean) => void;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const AppointmentFormValidation = getAppointmentSchema(type);

  // Form handler: Appointment Form
  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPsychotherapist: "",
      schedule: new Date(),
      consultationType: "",
      reason: "",
      consultationNotes: "",
      cancellationReason: "",
    },
  });

  // Appointment Submit Handler
  async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
    setIsLoading(true);

    // Handle Appointment Status
    let status;
    switch (type) {
      case "schedule":
        status = "scheduled";
        break;
      case "cancel":
        status = "cancelled";
        break;
      default:
        status = "pending";
        break;
    }

    try {
      // Create an Appointment
      if (type === "create" && clientId) {
        const appointmentData = {
          userId,
          client: clientId,
          primaryPsychotherapist: values.primaryPsychotherapist,
          schedule: new Date(values.schedule),
          consultationType: values.consultationType,
          reason: values.reason!,
          consultationNotes: values.consultationNotes,
          status: status as Status,
        };

        const appointment = await createAppointment(appointmentData);

        console.log(appointment);

        if (appointment) {
          form.reset();
          router.push(
            `/client/${userId}/new-appointment/success?appointmentId=${appointment.$id}`
          );
        }
      } else {
        // Update an Appointment
        const appointmentToUpdate = {
          userId,
          appointmentId: appointment?.$id!,
          appointment: {
            primaryPsychotherapist: values?.primaryPsychotherapist,
            schedule: new Date(values?.schedule),
            reason: values.reason!,
            consultationType: values?.consultationType,
            cancellationReason: values?.cancellationReason,
            status: status as Status,
          },
          type,
        };

        const updatedAppointment = await updateAppointment(appointmentToUpdate);

        if (updatedAppointment) {
          setOpen && setOpen(false);
          form.reset();
        }
      }
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  }

  let buttonLabel;

  switch (type) {
    case "cancel":
      buttonLabel = "Cancel Appointment";
      break;
    case "create":
      buttonLabel = "Create Appointment";
      break;
    case "schedule":
      buttonLabel = "Schedule Appointment";
    default:
      break;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        {type === "create" && (
          <section className="mb-12 space-y-4">
            <h1 className="header"> New Appointment</h1>
            <p className="text-dark-600">Schedule your appointment</p>
          </section>
        )}

        {type !== "cancel" && (
          <>
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="primaryPsychotherapist"
              label="Primary Psychotherapist"
              placeholder="Select your Psychotherapist"
            >
              {Psychotherapists.map((psychotherapist) => (
                <SelectItem
                  key={psychotherapist.name}
                  value={psychotherapist.name}
                >
                  <div className="flex cursor-pointer items-center gap-2">
                    <Image
                      src={psychotherapist.image}
                      width={32}
                      height={32}
                      alt={psychotherapist.name}
                      className="rounded-full border border-dark-500"
                    />
                    <p>{psychotherapist.name}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>

            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="schedule"
              label="Available Dates"
              showTimeSelect
              dateFormat="MM/dd/yyyy - h:mm aa"
            />
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="consultationType"
              label="Consultation Type"
              placeholder="Select Consultation Type"
              className="w-full xl:w-1/8"
            >
              {ConsultationType.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </CustomFormField>

            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="reason"
                label="Reason for appointment"
                placeholder="How are you feeling?"
              />
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="consultationNotes"
                label="Notes"
                placeholder="Enter Notes"
              />
            </div>
          </>
        )}

        {type === "cancel" && (
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="cancellationReason"
            label="Reason for Cancellation"
            placeholder="Please enter the reason for cancellation"
          />
        )}

        <SubmitButton
          isLoading={isLoading}
          className={`${
            type === "cancel" ? "shad-danger-btn" : "shad-primary-alt-btn"
          } w-full rounded-full`}
        >
          {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  );
};

export default AppointmentForm;
