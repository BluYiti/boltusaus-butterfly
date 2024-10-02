"use server";

import { ID, Query } from "node-appwrite";
import {
  PREASSESSMENT_COLLECTION_ID,
  DATABASE_ID,
  databases,
} from "../appwrite.config";
import { parseStringify } from "../utils";
import { revalidatePath } from "next/cache";
import { Question } from "@/constants/questions";

// Use Pre-Assessment
export const useAssessment = (questions: Question[]) => {
    type Answer = {
        question: string;
        answerInt: number;
        answerStr: string;
    }

    
}
