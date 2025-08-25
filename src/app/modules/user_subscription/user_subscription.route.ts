import { Router } from "express";

import { UserSubscriptionController } from "./user_subscription.controller";

const router = Router();

router.post(
  "/create-user-with-subscription",
  UserSubscriptionController.createUserWithSubscription
);

export const UserSubscriptionRoute = router;
