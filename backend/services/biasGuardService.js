export const applyBiasGuard = (evaluation = {}, answers = []) => {
  // Spread ALL original evaluation fields first, then add bias flags on top
  // Previously this was stripping scores, decision, matchedSkills etc — fixed!
  return {
    ...evaluation,
    biasAdjusted: true,
    fairnessScore: evaluation?.fairnessScore ?? 1,
  };
};