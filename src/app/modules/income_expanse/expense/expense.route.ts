import { Router } from "express";
import { auth } from "../../../middleware/auth/auth";
import { ExpenseController } from "./expense.controller";
const router = Router();
router.patch(
  "/change-expense-category",
  auth("USER"),
  ExpenseController.updateExpenseCategory
);
export const ExpenseRoute = router;
