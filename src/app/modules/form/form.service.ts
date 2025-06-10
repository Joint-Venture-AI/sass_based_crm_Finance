/* eslint-disable @typescript-eslint/no-explicit-any */
import { getFormsClient } from "../../google/googleService";

const createForm = async (title: string, questions: any[]) => {
  const forms = getFormsClient();

  console.log("object");
  // Step 1: Create the form
  const createResponse = await forms.forms.create({
    requestBody: {
      info: {
        title,
      },
    },
  });

  const formId = createResponse.data.formId;

  console.log(formId);

  // Step 2: Prepare question requests
  const requests = questions.map((q: any, index: number) => ({
    createItem: {
      item: {
        title: q.title,
        questionItem: {
          question: {
            required: q.required || false,
            choiceQuestion: {
              type: q.type || "RADIO", // Default to RADIO
              options: q.options.map((opt: string) => ({ value: opt })),
              shuffle: false,
            },
          },
        },
      },
      location: {
        index,
      },
    },
  }));

  // Step 3: Add questions to the form
  if (!formId) {
    throw new Error("Form ID is required");
  }

  await forms.forms.batchUpdate({
    formId: formId,
    requestBody: {
      requests,
    },
  });

  // Step 4: Return the final form
  const finalForm = await forms.forms.get({ formId });

  return finalForm.data;
};

export const FormService = { createForm };
