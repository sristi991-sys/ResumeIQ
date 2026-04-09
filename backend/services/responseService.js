export const buildResumeReport = (data) => {
  return {
    score: data.score,
    skills: data.skills,
    decision: data.score > 70 ? "Shortlisted" : "Not Shortlisted",
    bias: data.bias || "No bias detected",
    explanation: data.explanation,
    improvements: data.improvements
  };
};