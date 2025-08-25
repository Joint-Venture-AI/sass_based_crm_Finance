import httpStatus from "http-status";
import catchAsync from "../../../utils/serverTools/catchAsync";
import sendResponse from "../../../utils/serverTools/sendResponse";
import { ExpenseService } from "./expense.service";

const updateExpenseCategory = catchAsync(async (req, res) => {
  const result = await ExpenseService.updateExpenseCategory(
    req.user.userId,
    req.body.expenseId,
    req.body.category
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category changed successfully",
    data: result,
  });
});

export const ExpenseController = {
  updateExpenseCategory,
};
