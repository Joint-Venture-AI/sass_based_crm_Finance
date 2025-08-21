/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from "mongoose";
import { IFormSubmission } from "./formResponse.interface";
import { Form } from "../formCreate/form.model";
import { FormSubmission } from "./formResponse.model";

import { evaluateUserAnswers } from "../../../aiAgent/gemini";
import { extractAnswers } from "./utils";

const saveResponse = async (data: IFormSubmission) => {
  try {
    const form = await Form.findById(data.formId).lean();
    if (!form) {
      throw new Error("Form not found");
    }

    // Prevent duplicate submissions
    const existing = await FormSubmission.findOne({
      formId: data.formId,
      $or: [
        { userId: data.userId ? new Types.ObjectId(data.userId) : null },
        { userEmail: data.userEmail || null },
      ],
    });

    if (existing) {
      throw new Error("You have already submitted this form.");
    }

    // Auto-grade logic
    let score = 0;

    for (const question of form.questions) {
      const submitted = data.answers.find(
        (a) =>
          a.questionId === question._id?.toString() ||
          a.questionId === question.id
      );

      if (!submitted || question.correctAnswer === undefined) continue;

      const { userAnswer } = submitted;

      if (question.type === "checkboxes") {
        const correct = Array.isArray(question.correctAnswer)
          ? [...question.correctAnswer].sort().join(",")
          : "";
        const given = Array.isArray(userAnswer)
          ? [...userAnswer].sort().join(",")
          : "";
        if (correct === given) score++;
      } else {
        if (question.correctAnswer === userAnswer) score++;
      }
    }

    const submission = await FormSubmission.create({
      formId: new Types.ObjectId(data.formId),
      userId: data.userId ? new Types.ObjectId(data.userId) : null,
      userEmail: data.userEmail || null,
      answers: data.answers,
      score,
    });

    return submission;
  } catch (error: any) {
    throw new Error("Failed to save form response: " + error.message);
  }
};

const getFormResponseDetails = async (data: {
  formId: string;
  userEmail: string;
}) => {
  const result = await FormSubmission.aggregate([
    {
      $match: {
        formId: new Types.ObjectId(data.formId),
        userEmail: data.userEmail,
      },
    },
    {
      $lookup: {
        from: "forms",
        localField: "formId",
        foreignField: "_id",
        as: "form",
      },
    },
    { $unwind: "$form" },
    {
      $project: {
        userEmail: 1,
        score: 1,
        submittedAt: 1,
        // Map over answers and add matching question details:
        answers: {
          $map: {
            input: "$answers",
            as: "answer",
            in: {
              questionId: "$$answer.questionId",
              userAnswer: "$$answer.userAnswer",
              question: {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: "$form.questions",
                      as: "q",
                      cond: {
                        $eq: [{ $toString: "$$q._id" }, "$$answer.questionId"],
                      },
                    },
                  },
                  0,
                ],
              },
            },
          },
        },
        formTitle: "$form.title",
        formDescription: "$form.description",
      },
    },
  ]);

  return result;
};

const getFormResponseFromAllUser = async (formId: string) => {
  const result = await FormSubmission.aggregate([
    {
      $match: {
        formId: new Types.ObjectId(formId),
      },
    },
    {
      $lookup: {
        from: "forms",
        localField: "formId",
        foreignField: "_id",
        as: "form",
      },
    },
    { $unwind: "$form" },
    {
      $project: {
        _id: 0,
        formId: 1,
        userEmail: 1,
        submittedAt: 1,
        formTitle: "$form.title",
        formDescription: "$form.description",
      },
    },
  ]);

  return result;
};

const getUserEvaluationData = async (data: {
  formId: string;
  userEmail: string;
  userResponse: any;
}) => {
  const userAns = extractAnswers(data.userResponse);

  return {
    formId: data.formId,
    userEmail: data.userEmail,
    result: await evaluateUserAnswers(userAns),
  };
};

export const FormResponseService = {
  saveResponse,
  getFormResponseFromAllUser,
  getFormResponseDetails,
  getUserEvaluationData,
};
