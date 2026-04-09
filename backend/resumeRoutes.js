import express from "express";
import { evaluateResumeController } from "../controllers/resumeController.js";
import { upload } from "../middlewares/uploadMiddleware.js";
const router = express.Router();


router.post("/resume", upload.single("resume"), evaluateResumeController);

export default router;