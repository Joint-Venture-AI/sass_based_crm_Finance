import { Router } from "express";
import { BankController } from "./bank.controller";

const router = Router();
router.post("/create_link_token", BankController.getLinkToken);

export const BankRoute = router;
