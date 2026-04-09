export const buildExplanation = (evalData, role) => {
  const explanationPoints = evalData.explanation || [];

  
  const strengths = explanationPoints.filter(
    (e) =>
      e.toLowerCase().includes("good") ||
      e.toLowerCase().includes("strong") ||
      e.toLowerCase().includes("clear")
  );

  
  const weaknesses = explanationPoints.filter(
    (e) =>
      e.toLowerCase().includes("lack") ||
      e.toLowerCase().includes("missing") ||
      e.toLowerCase().includes("weak")
  );

  
  const biasSummary = [];

  if (evalData.biasFlags) {
    if (evalData.biasFlags.gender)
      biasSummary.push("Gender-related terms detected and neutralized");

    if (evalData.biasFlags.college)
      biasSummary.push("College/brand bias detected and reduced");

    if (evalData.biasFlags.name)
      biasSummary.push("Identity-related information ignored");

    if (evalData.biasFlags.buzzword)
      biasSummary.push("Buzzword overuse adjusted");

    if (evalData.biasFlags.shortAnswer)
      biasSummary.push("Short answers compensated to avoid unfair penalization");
  }

  return {
    summary: `Evaluation for ${role}`,

    decision: evalData.decision,
    reason: evalData.reason,

    scores: {
      clarity: evalData.clarity,
      relevance: evalData.relevance,
      reasoning: evalData.reasoning,
      finalScore: evalData.finalScore,
      confidence: evalData.confidence,
    },

    strengths: strengths.length ? strengths : ["No major strengths identified"],
    weaknesses: weaknesses.length ? weaknesses : ["No major weaknesses identified"],

    improvements: evalData.improvements || [],

    
    fairness: {
      biasAdjusted: evalData.biasAdjusted,
      fairnessScore: evalData.fairnessScore,
      notes: biasSummary.length
        ? biasSummary
        : ["No bias detected in evaluation"],
    },

    
    fairnessNote:
      "This evaluation focuses strictly on technical capability and removes bias related to identity, background, or communication style.",
  };
};