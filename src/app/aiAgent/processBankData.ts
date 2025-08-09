/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable arrow-body-style */

import generateContent from "./gemini";

export const processBankData = async (data: any) => {
  return await generateContent(data);
};
