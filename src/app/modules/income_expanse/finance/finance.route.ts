import { Router } from "express";
import { auth } from "../../../middleware/auth/auth";
import { FinanceController } from "./finance.controller";

const router = Router();
router.get(
  "/cash-flow",
  auth("USER"),
  FinanceController.getMonthlyCashFlowService
);
export const FinanceRoute = router;
