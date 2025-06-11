import { FormService } from "./form.service";
import status from "http-status";
import catchAsync from "../../utils/serverTools/catchAsync";
import sendResponse from "../../utils/serverTools/sendResponse";

const createForm = catchAsync(async (req, res) => {
  const { title, questions } = req.body;
  const result = await FormService.createForm(title, questions);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Form is created successfully",
    data: result,
  });
});

const getAllResponsesOfSingleForm = catchAsync(async (req, res) => {
  const result = await FormService.getAllResponsesOfSingleForm(
    req.params.formId
  );

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Form response is fetched successfully",
    data: result,
  });
});

const updatePublishSettingOfForm = catchAsync(async (req, res) => {
  const result = await FormService.updatePublishSettingOfForm(
    req.params.formId,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Form publishStatus is changed successfully",
    data: result,
  });
});

export const FormController = {
  createForm,
  getAllResponsesOfSingleForm,
  updatePublishSettingOfForm,
};
