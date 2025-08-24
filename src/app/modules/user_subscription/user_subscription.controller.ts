import httpStatus from "http-status";
import catchAsync from "../../utils/serverTools/catchAsync";
import sendResponse from "../../utils/serverTools/sendResponse";
import { UserSubscriptionService } from "./user_subscription.service";

const createPaymentIntent = catchAsync(async (req, res) => {
  const result = await UserSubscriptionService;

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Active subscriptions fetched successfully",
    data: result,
  });
});

export const UserSubscriptionController = { createPaymentIntent };
