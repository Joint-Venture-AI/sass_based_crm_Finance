/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Types } from "mongoose";
import { IForm } from "./form.interface";
import { Form } from "./form.model";

const createForm = async (data: IForm, userId: string) => {
  try {
    const form = await Form.create({
      title: data.title,
      description: data.description,
      createdBy: new Types.ObjectId(userId),
      questions: data.questions.map((q) => ({
        type: q.type,
        label: q.label,
        required: q.required ?? false,
        options: q.options ?? [],
        correctAnswer: q.correctAnswer, // use correct key name
      })),
    });

    return form;
  } catch (error: any) {
    throw new Error("Failed to create form: " + error.message);
  }
};

export const FormService = {
  createForm,
};
