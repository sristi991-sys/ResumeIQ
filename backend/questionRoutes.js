import express from "express";
import { getQuestions } from "../controllers/questionController.js";

const router = express.Router();


router.post("/questions", getQuestions);

export default router;