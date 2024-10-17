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

import { CustomFormField, FormFieldType } from "../CustomFormField";
import { SelectItem } from "../ui/select";
import SubmitButton from "../SubmitButton";
import Image from "next/image";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

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
  const [selectedPsychotherapist, setSelectedPsychotherapist] =
    useState<string>("");

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

        if (appointment) {
          form.reset();
          router.push(
            `/client/${userId}/new-appointment/success?appointmentId=${appointment.$id}`
          );
        }
      } else {
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
      buttonLabel = "Proceed to Payment";
      break;
    case "schedule":
      buttonLabel = "Schedule Appointment";
      break;
    default:
      break;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        {type === "create" && (
          <section className="mb-12 space-y-4">
            <h1 className="header"> Counseling and Therapy</h1>
            <p className="text-dark-600">Schedule your appointment</p>
          </section>
        )}

        {type !== "cancel" && (
          <>
            <CustomFormField
              fieldType={FormFieldType.TOGGLEGROUP}
              control={form.control}
              name="primaryPsychotherapist"
              label="Choose your psychotherapist"
            >
              <ToggleGroup
                type="single"
                value={selectedPsychotherapist}
                onValueChange={(value) => {
                  setSelectedPsychotherapist(value);
                  form.setValue("primaryPsychotherapist", value);
                }}
                className="flex flex-wrap gap-4"
              >
                {Psychotherapists.map((psychotherapist) => (
                  <ToggleGroupItem
                    key={psychotherapist.id}
                    value={psychotherapist.name}
                    aria-label={`Toggle ${psychotherapist.name}`}
                    className={`border border-gray-300 rounded-md p-2 hover:bg-gray-100 flex cursor-pointer items-center gap-2
                    ${
                      selectedPsychotherapist === psychotherapist.name
                        ? "bg-blue-100 border-blue-400"
                        : ""
                    }`}
                  >
                    <Image
                      src={psychotherapist.image}
                      width={32}
                      height={32}
                      alt={psychotherapist.name}
                      className="rounded-full border border-blue-300"
                    />
                    <p>{psychotherapist.name}</p>
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </CustomFormField>

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

            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="schedule"
              label="Available Dates"
              showTimeSelect
              dateFormat="MM/dd/yyyy - h:mm aa"
            />
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
