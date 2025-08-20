/* eslint-disable @typescript-eslint/no-explicit-any */
export interface FormattedAnswer {
  question: string;
  userAnswer: string;
  options: string[];
}

export function extractAnswers(submissions: any[]): FormattedAnswer[] {
  if (!submissions || submissions.length === 0) return [];

  return submissions[0].answers.map((ans: any) => ({
    question: ans.question.label,
    userAnswer: ans.userAnswer,
    options: ans.question.options || [],
  }));
}
