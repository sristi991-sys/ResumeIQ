import express from "express";
import {
  getDashboardStats,
  getAllCandidates,
  getCandidateById,
} from "../controllers/dashboardController.js";

const router = express.Router();


router.get("/stats", getDashboardStats);


router.get("/candidates", getAllCandidates);


router.get("/candidate/:id", getCandidateById);

export default router;