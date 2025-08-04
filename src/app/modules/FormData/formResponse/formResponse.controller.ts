import status from "http-status";
import catchAsync from "../../../utils/serverTools/catchAsync";
import sendResponse from "../../../utils/serverTools/sendResponse";
import { FormResponseService } from "./formResponse.service";

const saveResponse = catchAsync(async (req, res) => {
  const result = await FormResponseService.saveResponse(req.body);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Form response saved successfully",
    data: result,
  });
});
const getFormResponseFromAllUser = catchAsync(async (req, res) => {
  const result = await FormResponseService.getFormResponseFromAllUser(
    req.body.formId
  );

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "FormResponse of all user fetched successfully",
    data: result,
  });
});
const getFormResponseDetails = catchAsync(async (req, res) => {
  const result = await FormResponseService.getFormResponseDetails(req.body);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "FormResponse of a user fetched successfully",
    data: result,
  });
});

export const FormResponseController = {
  saveResponse,
  getFormResponseDetails,
  getFormResponseFromAllUser,
};
