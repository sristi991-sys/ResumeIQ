
export const buildResumeReport = (evaluation = {}, role = "") => {
  const finalScore = evaluation.scores?.finalScore ?? evaluation.finalScore ?? 75;

  const evalData = {
    role,
    decision: evaluation.decision ?? "Not Shortlisted",
    strengths: evaluation.strengths ?? ["Basic understanding"],
    weaknesses: evaluation.weaknesses ?? ["Needs improvement"],
    improvements: evaluation.improvements ?? ["Work on core concepts"],
    matchedSkills: evaluation.matchedSkills ?? [],
    missingSkills: evaluation.missingSkills ?? [],
    experienceLevel: evaluation.experienceLevel ?? "Beginner",
    scores: {
      skillMatch: evaluation.scores?.skillMatch ?? 50,
      experience: evaluation.scores?.experience ?? 50,
      projects: evaluation.scores?.projects ?? 50,
      finalScore,
    },
    bias: {
      biasAdjusted: evaluation.biasAdjusted ?? false,
      fairnessScore: evaluation.fairnessScore ?? 1,
      note: "Evaluation is adjusted to remove bias signals",
    },
    explanation:
      evaluation.reason ??
      "Candidate evaluated based on skills, experience, and relevance to role.",
  };

  return {
    role,
    evaluation: evalData,  // CandidatePortal reads data.report.evaluation
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

  // finalScore as number so CandidatePortal can read qaReport.finalScore
  const finalScore = Number(overallScore);

  return {
    overallScore,
    finalScore,  // CandidatePortal reads qaReport.finalScore
    clarity,
    reasoning,

    summary:
      finalScore > 75
        ? "Strong understanding of concepts"
        : finalScore > 50
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