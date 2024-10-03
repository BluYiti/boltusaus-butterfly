"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import { createUser } from "@/lib/actions/client.actions";
import { SignUpFormValidation } from "@/lib/validation";

import { CustomFormField, FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";

const SignUpForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Form Handler: Sign Up Form
  const form = useForm<z.infer<typeof SignUpFormValidation>>({
    resolver: zodResolver(SignUpFormValidation),
    defaultValues: {
      firstName: "",
      email: "",
      phone: "",
    },
  });

  // Submit Handler: Proceed to Pre-Assessment
  async function onSubmit({
    firstName,
    email,
    phone,
  }: z.infer<typeof SignUpFormValidation>) {
    setIsLoading(true);

    try {
      const userData = { firstName, email, phone };

      const user = await createUser(userData);

      if (user) router.push(`/client/sign-up/pre-assessment`);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12">
          <div>
            <br />
            <h1 className="header text-center">A.M. Peralta</h1>
            <h2 className="header text-center">Psychological Services</h2>
            <br />
            <p className="text-dark-500 text-center">
              Take the first step and sign up for our pre-assessment.
            </p>
          </div>
        </section>
        
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="firstName"
          label="What is your first name?"
          placeholder="Butterfly"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />

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

        <SubmitButton isLoading={isLoading} className="shad-primary-alt-btn w-full">
          Get Started
        </SubmitButton>
      </form>
    </Form>
  );
};

export default SignUpForm;
