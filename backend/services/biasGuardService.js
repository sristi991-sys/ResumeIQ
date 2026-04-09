export const applyBiasGuard = (evaluation = {}, answers = []) => {
  return {
    clarity: evaluation?.clarity ?? 5,
    relevance: evaluation?.relevance ?? 5,
    reasoning: evaluation?.reasoning ?? 5,

    strengths: evaluation?.strengths ?? ["Basic understanding"],
    weaknesses: evaluation?.weaknesses ?? ["Needs depth"],
    improvements: evaluation?.improvements ?? ["Practice more"],

    biasAdjusted: true,
    fairnessScore: evaluation?.fairnessScore ?? 1,
  };
};