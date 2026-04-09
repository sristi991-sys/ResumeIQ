import express from "express";
import { submitAnswer } from "../controllers/candidateController.js";

const router = express.Router();


router.post("/submitAnswer", submitAnswer);

export default router;