export const calculateScore = (e) => {
  
  const weights = {
    clarity: 0.3,
    relevance: 0.4, 
    reasoning: 0.3,
  };

  let score =
    e.clarity * weights.clarity +
    e.relevance * weights.relevance +
    e.reasoning * weights.reasoning;

  
  if (e.confidence) {
    score = score * (0.9 + e.confidence * 0.1);
  }

  
  if (e.fairnessScore && e.fairnessScore < 1) {
    score = score * e.fairnessScore;
  }

  
  score = Math.min(Math.max(score, 0), 10);

  return Number(score.toFixed(2));
};