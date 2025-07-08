/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable arrow-body-style */

import generateContent from "./gemini";

export const processBankData = async (data: string) => {
  return await generateContent(data);
};
