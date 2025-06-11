// models/Form.model.ts

import { model, Schema } from "mongoose";
import { IForm } from "./form.interface";

const FormSchema = new Schema<IForm>(
  {
    formId: {
      type: String,
      required: true,
      unique: true,
    },
    formUrl: {
      type: String,
      required: true,
    },
    isUnpublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt fields
  }
);

export const Form = model<IForm>("Form", FormSchema);
