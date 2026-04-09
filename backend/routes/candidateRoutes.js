import express from "express";
import { submitAnswer, registerCandidate } from "../controllers/candidateController.js";

const router = express.Router();

router.post("/candidates/register", registerCandidate);
router.post("/submitAnswer", submitAnswer);

export default router;