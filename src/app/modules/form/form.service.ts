/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { google, Auth, forms_v1 } from "googleapis";
import { getAuthClient } from "../../google/googleAuth";
import { Form } from "./form.model";

type QuestionType =
  | "SHORT_ANSWER"
  | "PARAGRAPH"
  | "MULTIPLE_CHOICE"
  | "CHECKBOX";

interface Question {
  title: string;
  type: QuestionType;
  options?: string[]; // Only for choice-based questions
}

const createForm = async (title: string, questions: Question[]) => {
  try {
    const auth = (await getAuthClient()) as Auth.OAuth2Client;
    const forms = google.forms({ version: "v1", auth });

    // Step 1: Create a form shell
    const formRes = await forms.forms.create({
      requestBody: {
        info: {
          title,
        },
      },
    });

    const formId = formRes.data.formId;
    if (!formId)
      throw new Error("Form ID was not returned by Google Forms API");

    // Step 2: Add default questions (Email + Mobile)
    const defaultQuestions: Question[] = [
      {
        title: "Email Address",
        type: "SHORT_ANSWER",
      },
      {
        title: "Mobile Number (include country code, e.g. +1 1234567890)",
        type: "SHORT_ANSWER",
      },
    ];

    const allQuestions = [...defaultQuestions, ...questions];

    // Step 3: Function to map question types
    const buildQuestion = (question: Question): forms_v1.Schema$Question => {
      switch (question.type) {
        case "SHORT_ANSWER":
          return { textQuestion: { paragraph: false } };
        case "PARAGRAPH":
          return { textQuestion: { paragraph: true } };
        case "MULTIPLE_CHOICE":
          return {
            choiceQuestion: {
              type: "RADIO",
              options: question.options?.map((opt) => ({ value: opt })) || [],
              shuffle: false,
            },
          };
        case "CHECKBOX":
          return {
            choiceQuestion: {
              type: "CHECKBOX",
              options: question.options?.map((opt) => ({ value: opt })) || [],
              shuffle: false,
            },
          };
        default:
          throw new Error(`Unsupported question type: ${question.type}`);
      }
    };

    // Step 4: Build requests for all questions
    const requests: forms_v1.Schema$Request[] = allQuestions.map(
      (question, index) => ({
        createItem: {
          item: {
            title: question.title,
            questionItem: {
              question: buildQuestion(question),
            },
          },
          location: { index },
        },
      })
    );

    // Step 5: Send batchUpdate to add questions
    await forms.forms.batchUpdate({
      formId,
      requestBody: {
        requests: [
          ...requests,
          {
            updateSettings: {
              settings: { emailCollectionType: "VERIFIED" },
              updateMask: "emailCollectionType",
            },
          },
        ],
      },
    });

    // Step 6: Return form info

    const formInfo = {
      formId,
      formUrl: `https://docs.google.com/forms/d/${formId}/edit`,
    };

    if (formId) {
      await Form.create(formInfo);
    }

    return {
      ...formInfo,
    };
  } catch (err) {
    console.error("❌ Error creating Google Form:", err);
    throw new Error("Failed to create form");
  }
};

const getAllResponsesOfSingleForm = async (formId: string) => {
  try {
    const auth = (await getAuthClient()) as Auth.OAuth2Client;
    const forms = google.forms({ version: "v1", auth });

    // Step 1 & 2 in parallel: fetch form details and first page of responses simultaneously
    const [formDetails, firstResponsePage] = await Promise.all([
      forms.forms.get({ formId }),
      forms.forms.responses.list({
        formId,
        fields:
          "responses(responseId,createTime,respondentEmail,answers),nextPageToken",
        pageSize: 200,
      }),
    ]);

    // Build questionId → title map
    const items = formDetails.data.items || [];
    const questionMap: Record<string, string> = {};
    for (const item of items) {
      if (item.questionItem?.question?.questionId) {
        questionMap[item.questionItem.question.questionId] =
          item.title ?? "Untitled Question";
      }
    }

    // Prepare response array & initial page token
    const responses: any[] = [];
    let pageToken: string | undefined =
      firstResponsePage.data.nextPageToken ?? undefined;

    // Process first page responses immediately
    if (firstResponsePage.data.responses) {
      for (const r of firstResponsePage.data.responses) {
        const answerList: { question: string; answer: string }[] = [];
        for (const [questionId, answerObj] of Object.entries(r.answers || {})) {
          const questionText = questionMap[questionId] || "Unknown Question";
          const answerVal =
            (answerObj as any).textAnswers?.answers?.[0]?.value ?? "";
          answerList.push({ question: questionText, answer: answerVal });
        }
        responses.push({
          respondentEmail: r.respondentEmail ?? null,
          responseId: r.responseId,
          submittedAt: r.createTime,
          answers: answerList,
        });
      }
    }

    // Fetch remaining pages sequentially (if any)
    while (pageToken) {
      const res: any = await forms.forms.responses.list({
        formId,
        pageToken,
        fields:
          "responses(responseId,createTime,respondentEmail,answers),nextPageToken",
        pageSize: 200,
      });

      if (res.data.responses) {
        for (const r of res.data.responses) {
          const answerList: { question: string; answer: string }[] = [];
          for (const [questionId, answerObj] of Object.entries(
            r.answers || {}
          )) {
            const questionText = questionMap[questionId] || "Unknown Question";
            const answerVal =
              (answerObj as any).textAnswers?.answers?.[0]?.value ?? "";
            answerList.push({ question: questionText, answer: answerVal });
          }
          responses.push({
            responseId: r.responseId,
            submittedAt: r.createTime,
            answers: answerList,
          });
        }
      }

      pageToken = res.data.nextPageToken;
    }

    return responses;
  } catch (err) {
    console.error("❌ Failed to fetch form responses:", err);
    throw new Error("Unable to retrieve responses with questions");
  }
};

const updatePublishSettingOfForm = async (
  formId: string,
  data: {
    isPublished: boolean;
    isAcceptingResponses: boolean;
  }
) => {
  const auth = (await getAuthClient()) as Auth.OAuth2Client;
  const forms = google.forms({ version: "v1", auth });

  // Use the setPublishSettings method
  const res = await forms.forms.setPublishSettings({
    formId,
    requestBody: {
      publishSettings: {
        publishState: data,
      },
    },
  });

  if (res.data.formId) {
    await Form.findOneAndUpdate(
      { formId: res.data.formId },
      { isUnpublished: true },
      { new: true }
    );
  }

  return res.data;
};

export const FormService = {
  createForm,
  getAllResponsesOfSingleForm,
  updatePublishSettingOfForm,
};
