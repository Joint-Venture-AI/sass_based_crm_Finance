import { Router } from "express";
import { BankController } from "./bank.controller";

const router = Router();
// plaid-bank
router.post("/create_link_token", BankController.getLinkToken);
router.post("/exchange_public_token", BankController.exchangePublicToken);
router.post("/select-account", BankController.selectAccount);
router.post("/fetch-transection", BankController.fetchTransactions);

// go-card-sell

router.get("/get-token", BankController.getToken);
router.get("/get-bank", BankController.chooseBank);
router.post("/build-link", BankController.BuildLink);
router.get("/account-list/:rId", BankController.getAccountList);
router.get("/get-transection/:aId", BankController.getTransection);

// Ai Response -- for test only
router.post("/ai-response", BankController.getApiResponse);

export const BankRoute = router;
