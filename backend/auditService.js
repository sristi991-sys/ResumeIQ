import AuditLog from "../models/logsModel.js";

export const createAuditLog = async ({
  candidateId,
  rawAnswers,
  aiRaw,
  finalEvaluation,
  role,
  anonId,
}) => {
  try {
    
    const logData = {
      candidateId,

      rawAnswers,

      aiRaw,

      
      finalEvaluation: {
        clarity: finalEvaluation.clarity,
        relevance: finalEvaluation.relevance,
        reasoning: finalEvaluation.reasoning,
        finalScore: finalEvaluation.finalScore,
        decision: finalEvaluation.decision,
      },

      
      biasInfo: {
        biasAdjusted: finalEvaluation.biasAdjusted,
        fairnessScore: finalEvaluation.fairnessScore,
        flags: finalEvaluation.biasFlags || {
          gender: false,
          college: false,
          name: false,
        },
      },

      role,
      anonId,

      timestamp: new Date(),
    };

    return await AuditLog.create(logData);
  } catch (error) {
    console.error("🔥 Audit Log Error:", error.message);
  }
};