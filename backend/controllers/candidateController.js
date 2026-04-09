import Candidate from "../models/candidate.js";
import Evaluation from "../models/evaluation.js";

import { evaluateAnswers } from "../services/evaluationService.js";
import { applyBiasGuard } from "../services/biasGuardService.js";
import { calculateScore } from "../services/scoringService.js";
import { createAuditLog } from "../services/auditService.js";
import { buildKnowledgeReport } from "../services/reportService.js";

// ─── Register Candidate (Step 3.5: Personal Info Form) ───────────────────────
export const registerCandidate = async (req, res) => {
  try {
    const { name, email, phone, linkedin, role, atsScore, atsDecision } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({ success: false, error: "Name, email, and role are required." });
    }

    const anonId = "CAND-" + Date.now();

    const candidate = await Candidate.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || "",
      linkedin: linkedin?.trim() || "",
      role,
      anonId,
      atsScore: atsScore ?? null,
      atsDecision: atsDecision ?? null,
      answers: [],
      status: "Pending",
    });

    res.status(201).json({
      success: true,
      message: "Candidate registered successfully",
      candidateId: candidate._id,
      anonId: candidate.anonId,
    });
  } catch (error) {
    console.error("🔥 Register Candidate Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ─── Submit Interview Answers ─────────────────────────────────────────────────
export const submitAnswer = async (req, res) => {
  try {
    const { role, qa, candidateId } = req.body;

    if (!role || !qa || !Array.isArray(qa) || qa.length === 0) {
      return res.status(400).json({
        message: "Invalid input: role and QA required",
      });
    }

    const answers = qa.map((item) => item.answer);

    // Reuse existing candidate record if candidateId provided (from registration step)
    let candidate;
    if (candidateId) {
      candidate = await Candidate.findByIdAndUpdate(
        candidateId,
        { answers, status: "Evaluated" },
        { new: true }
      );
    }
    if (!candidate) {
      const anonId = "CAND-" + Date.now();
      candidate = await Candidate.create({ role, answers, anonId });
    }

    const aiEvaluation = (await evaluateAnswers(role, qa)) || {};

    const unbiasedEval = applyBiasGuard(aiEvaluation, answers);

    const finalScore = calculateScore(unbiasedEval);

    const evaluation = await Evaluation.create({
      candidateId: candidate._id,
      ...unbiasedEval,
      finalScore,
    });

    await createAuditLog({
      candidateId: candidate._id,
      rawAnswers: qa,
      aiRaw: JSON.stringify(aiEvaluation),
      finalEvaluation: evaluation,
    });

    const report = buildKnowledgeReport(evaluation);

    res.status(200).json({
      message: "Knowledge evaluation complete",
      report,
    });

  } catch (error) {
    console.error("🔥 ERROR:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};