import { Router } from "express";
import { FormController } from "./form.controller";
import { auth } from "../../../middleware/auth/auth";

const router = Router();
router.post("/create-form", auth("ADMIN"), FormController.createForm);

export const FormRoute = router;
