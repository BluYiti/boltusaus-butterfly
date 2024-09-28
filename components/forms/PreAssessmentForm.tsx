"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { questions } from "@/constants/questions";

import { CustomFormField } from "../CustomFormField";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form } from "@/components/ui/form";
import SubmitButton from "../SubmitButton";
import { PreAssessmentFormValidation } from "@/lib/validation";

const PreAssessmentForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof PreAssessmentFormValidation>>({
    resolver: zodResolver(PreAssessmentFormValidation),
    defaultValues: {
      answers: {},
    },
  });

  const onSubmit = async (
    values: z.infer<typeof PreAssessmentFormValidation>
  ) => {
    setIsLoading(true);

    try {
      // Send answers to psychotherapist's email or API
      console.log(values.answers);
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        {questions.map((question, index) => (
          <CustomFormField
            key={index}
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name={`question_${index}`}
            label={question.text}
            renderSkeleton={(field) => (
              <FormControl>
                <RadioGroup
                  className="flex h-11 gap-4 xl:justify-between"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  {question.options.map((option) => (
                    <div key={option.value} className="radio-group">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value} className="cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
            )}
            className="w-full"
          />
        ))}
        <SubmitButton
          isLoading={isLoading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Submit Pre-assessment
        </SubmitButton>
      </form>
    </Form>
  );
};

export default PreAssessmentForm;
