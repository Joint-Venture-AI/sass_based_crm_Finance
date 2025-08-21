export type QuestionType =
  | "shortAnswer"
  | "paragraph"
  | "multipleChoice"
  | "checkboxes"
  | "dropdown";

export interface IQuestion {
  type: QuestionType;
  label: string;
  required: boolean;
  options?: string[];
  correctAnswer?: string | string[]; // ← this holds quiz correct answer
}

export interface IForm {
  title: string;
  description: string;
  questions: IQuestion[];
}
