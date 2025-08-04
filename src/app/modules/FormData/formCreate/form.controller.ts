import { FormService } from "./form.service";
import status from "http-status";
import catchAsync from "../../../utils/serverTools/catchAsync";
import sendResponse from "../../../utils/serverTools/sendResponse";

const createForm = catchAsync(async (req, res) => {
  const result = await FormService.createForm(req.body, req.user.userId);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Form is created successfully",
    data: result,
  });
});

export const FormController = {
  createForm,
};
