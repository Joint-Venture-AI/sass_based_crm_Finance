import { Schema, model } from "mongoose";

const questionSchema = new Schema({
  type: {
    type: String,
    enum: [
      "shortAnswer",
      "paragraph",
      "multipleChoice",
      "checkboxes",
      "dropdown",
    ],
    required: true,
  },
  label: { type: String, required: true },
  required: { type: Boolean, default: false },
  options: [String],
  correctAnswer: Schema.Types.Mixed, // can be string or string[] (checkboxes)
});

const formSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    questions: [questionSchema],
  },
  { timestamps: true }
);

export const Form = model("Form", formSchema);
