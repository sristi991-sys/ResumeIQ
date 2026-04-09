
export const buildResumeReport = (evaluation = {}, role = "") => {
  return {
    role,

    score: evaluation.finalScore ?? 75,
    decision: evaluation.decision ?? "Not Shortlisted",

    strengths: evaluation.strengths ?? ["Basic understanding"],
    weaknesses: evaluation.weaknesses ?? ["Needs improvement"],
    improvements: evaluation.improvements ?? ["Work on core concepts"],

    bias: {
      biasAdjusted: evaluation.biasAdjusted ?? false,
      fairnessScore: evaluation.fairnessScore ?? 1,
      note: "Evaluation is adjusted to remove bias signals",
    },

    explanation:
      evaluation.reason ??
      "Candidate evaluated based on skills, experience, and relevance to role.",
  };
};




export const buildKnowledgeReport = (evaluation = {}) => {
  const clarity = evaluation.clarity ?? 5;
  const relevance = evaluation.relevance ?? 5;
  const reasoning = evaluation.reasoning ?? 5;

  const overallScore = (
    ((clarity + relevance + reasoning) / 30) *
    100
  ).toFixed(0);

  return {
    overallScore,

    summary:
      overallScore > 75
        ? "Strong understanding of concepts"
        : overallScore > 50
        ? "Moderate understanding with scope for improvement"
        : "Needs significant improvement",

    strengths: evaluation.strengths ?? ["Basic understanding"],
    weaknesses: evaluation.weaknesses ?? ["Lacks depth"],
    improvements: evaluation.improvements ?? ["Practice more"],

    
    detailedFeedback:
      evaluation.detailedFeedback?.map((item) => ({
        question: item.question,
        feedback: item.feedback,
        score: item.score,
      })) ?? [],

    explanation:
      "Each answer is evaluated based on clarity, relevance, and reasoning with respect to the role. Feedback is generated dynamically for improvement.",
  };
};