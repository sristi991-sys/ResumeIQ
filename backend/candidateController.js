import Candidate from "../models/candidate.js";
import Evaluation from "../models/evaluation.js";

import { evaluateAnswers } from "../services/evaluationService.js";
import { applyBiasGuard } from "../services/biasGuardService.js";
import { calculateScore } from "../services/scoringService.js";
import { createAuditLog } from "../services/auditService.js";
import { buildKnowledgeReport } from "../services/reportService.js";

export const submitAnswer = async (req, res) => {
  try {
    const { role, qa } = req.body;

    
    if (!role || !qa || !Array.isArray(qa) || qa.length === 0) {
      return res.status(400).json({
        message: "Invalid input: role and QA required",
      });
    }

    const answers = qa.map((item) => item.answer);

    const anonId = "CAND-" + Date.now();

    
    const candidate = await Candidate.create({
      role,
      answers,
      anonId,
    });

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