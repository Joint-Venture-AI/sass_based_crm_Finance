import { Router } from "express";
import { FormController } from "./form.controller";

const router = Router();
router.post("/create-form", FormController.createForm);
router.get(
  "/get-form-response/:formId",
  FormController.getAllResponsesOfSingleForm
);
router.patch(
  "/update-publish-setting/:formId",
  FormController.updatePublishSettingOfForm
);
export const FormRoute = router;
