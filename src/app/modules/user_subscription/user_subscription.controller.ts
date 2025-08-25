import httpStatus, { status } from "http-status";
import catchAsync from "../../utils/serverTools/catchAsync";
import sendResponse from "../../utils/serverTools/sendResponse";
import { UserSubscriptionService } from "./user_subscription.service";

const createUserWithSubscription = catchAsync(async (req, res) => {
  const result = await UserSubscriptionService.createUserWithSubscription(
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User and payment intent created successfully.Verify email first.",
    data: result,
  });
});

const stripeWebhook = catchAsync(async (req, res) => {
  const sig = req.headers["stripe-signature"] as string;
  const rawBody = req.body;

  const result = await UserSubscriptionService.stripeWebhook(rawBody, sig);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Webhook response",
    data: result,
  });
});

export const UserSubscriptionController = {
  createUserWithSubscription,
  stripeWebhook,
};
