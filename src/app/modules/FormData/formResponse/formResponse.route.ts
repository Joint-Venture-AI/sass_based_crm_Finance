import { Router } from "express";

import { FormResponseController } from "./formResponse.controller";

const router = Router();
router.post("/save-response", FormResponseController.saveResponse);
router.post(
  "/get-form-response-list",
  FormResponseController.getFormResponseFromAllUser
);
router.post(
  "/get-single-user-form-response",
  FormResponseController.getFormResponseDetails
);

router.post(
  "/ai-evaluation-data-of-a-user",
  FormResponseController.getUserEvaluationData
);

export const FormResponseRoute = router;
