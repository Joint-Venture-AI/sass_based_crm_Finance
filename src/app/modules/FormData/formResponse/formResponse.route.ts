import { Router } from "express";

import { FormResponseController } from "./formResponse.controller";

const router = Router();
router.post("/save-response", FormResponseController.saveResponse);
router.get(
  "/get-form-response-list",
  FormResponseController.getFormResponseFromAllUser
);
router.get(
  "/get-single-user-form-response",
  FormResponseController.getFormResponseDetails
);

export const FormResponseRoute = router;
