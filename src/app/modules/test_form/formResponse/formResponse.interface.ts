import { Types } from "mongoose";

export interface IUserAnswer {
  questionId: string; // now this is the MongoDB _id of the question
  userAnswer: string | string[];
}

export interface IFormSubmission {
  formId: Types.ObjectId;
  userId: Types.ObjectId;
  userEmail: string;
  score: number;
  answers: IUserAnswer[];
  submittedAt: Date;
}
