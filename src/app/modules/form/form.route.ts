import { Router } from "express";
import { FormController } from "./form.controller";

const router = Router();
router.post("/create-form", FormController.createForm);
export const FormRoute = router;
