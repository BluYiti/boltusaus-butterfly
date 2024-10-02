"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Form } from "@/../components/ui/form";
import { CustomFormField } from "../CustomFormField";
import { LoginFormValidation } from "@/../lib/validation";
import Link from "next/link";

import { loginUser } from "@/../lib/actions/client.actions";
import SubmitButton from "../SubmitButton";

export enum FormFieldType {
  INPUT = "input",
  PASSWORD = "password",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
}

const LoginForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Login Form handler
  const form = useForm<z.infer<typeof LoginFormValidation>>({
    resolver: zodResolver(LoginFormValidation),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Submit Handler
  async function onSubmit({
    username,
    password,
  }: z.infer<typeof LoginFormValidation>) {
    setIsLoading(true);

    try {
      // const userData = { username, password };
      // const user = await registerUser(userData);
      // if (user) router.push(`/client/${user.$id}/dashboard`)
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="username"
          label={<span className="text-light-200">Username</span>}
          placeholder="Butterfly"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />
        <CustomFormField
          fieldType={FormFieldType.PASSWORD}
          control={form.control}
          name="password"
          label={<span className="text-light-200">Password</span>}
          placeholder=""
          iconSrc="/assets/icons/lock.svg"
          iconAlt="user"
        />
        <div className="flex justify-center mb-2">
          <input type="checkbox" id="remember-me" className="mr-2" />
          <label htmlFor="remember-me" className="text-light-200">
            Remember me
          </label>
        </div>
        <SubmitButton isLoading={isLoading}>
          <Link href="/client/66cd64200032246acd7f/dashboard">
            Login
          </Link>
        </SubmitButton>
      </form>
    </Form>
  );
};

export default LoginForm;
