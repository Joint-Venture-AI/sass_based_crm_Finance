import { Schema, model } from "mongoose";
import { IFormSubmission } from "./formResponse.interface";

const formSubmissionSchema = new Schema<IFormSubmission>(
  {
    formId: { type: Schema.Types.ObjectId, ref: "Form", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    userEmail: { type: String, default: null },
    answers: [
      {
        _id: false,
        questionId: { type: String, required: true },
        userAnswer: Schema.Types.Mixed,
      },
    ],
    score: { type: Number, default: null },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const FormSubmission = model("FormSubmission", formSubmissionSchema);
