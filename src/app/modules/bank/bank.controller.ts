import status from "http-status";
import catchAsync from "../../utils/serverTools/catchAsync";
import sendResponse from "../../utils/serverTools/sendResponse";
import { BankService } from "./bank.service";

const getLinkToken = catchAsync(async (req, res) => {
  const result = await BankService.getLinkToken();

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Link token created successfully",
    data: result,
  });
});

export const BankController = {
  getLinkToken,
};
