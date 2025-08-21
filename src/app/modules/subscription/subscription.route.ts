import { Router } from "express";
import { SubscriptionController } from "./subscription.controller";
import { auth } from "../../middleware/auth/auth";

const router = Router();

// 🔹 Get all active subscriptions
router.get(
  "/",
  auth("USER", "ADMIN"),
  SubscriptionController.getAllActiveSubscriptions
);

// 🔹 Get subscription by ID
router.get(
  "/:id",
  auth("USER", "ADMIN"),
  SubscriptionController.getSubscriptionById
);

export const SubscriptionRoute = router;
