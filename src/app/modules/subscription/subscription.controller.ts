import httpStatus from "http-status";
import catchAsync from "../../utils/serverTools/catchAsync";
import { SubscriptionService } from "./subscription.service";
import sendResponse from "../../utils/serverTools/sendResponse";

// ✅ Get all active subscriptions
const getAllActiveSubscriptions = catchAsync(async (req, res) => {
  const result = await SubscriptionService.getAllActiveSubscriptions();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Active subscriptions fetched successfully",
    data: result,
  });
});

// ✅ Get subscription by ID
const getSubscriptionById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SubscriptionService.getSubscriptionById(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Subscription fetched successfully",
    data: result,
  });
});

export const SubscriptionController = {
  getAllActiveSubscriptions,
  getSubscriptionById,
};
