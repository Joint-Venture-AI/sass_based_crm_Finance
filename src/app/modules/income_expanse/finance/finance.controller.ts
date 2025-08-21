import status from "http-status";
import catchAsync from "../../../utils/serverTools/catchAsync";
import sendResponse from "../../../utils/serverTools/sendResponse";
import { FinanceService } from "./finance.service";

const getMonthlyCashFlowService = catchAsync(async (req, res) => {
  const result = await FinanceService.getMonthlyCashFlowService(
    req.user.userId
  );

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Monthly cash flow data fetched successfully",
    data: result,
  });
});

export const FinanceController = {
  getMonthlyCashFlowService,
};
