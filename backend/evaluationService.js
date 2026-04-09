import { groqService } from "./groqService.js";

export const evaluateAnswers = async (role, qa) => {
  try {
    if (!qa || qa.length === 0) {
      throw new Error("No QA provided");
    }

    const formattedQA = qa
      .map(
        (item, i) => `
Q${i + 1}: ${item.question}
A${i + 1}: ${item.answer}
`
      )
      .join("\n");

    const prompt = `
You are an expert technical interviewer.

Evaluate the candidate for role: ${role}

${formattedQA}

Give STRICT JSON output:

{
  "clarity": number (0-10),
  "relevance": number (0-10),
  "reasoning": number (0-10),
  "strengths": [list],
  "weaknesses": [list],
  "improvements": [list],
  "detailedFeedback": [
    {
      "question": "...",
      "feedback": "...",
      "score": number (0-10)
    }
  ]
}
`;

    const aiResponse = await groqService(prompt);
    
    let parsed;
    try {
      parsed = JSON.parse(aiResponse);
    } catch (err) {
      console.log("AI parse failed, fallback used");

      return fallbackEvaluation(qa);
    }

    return parsed;

  } catch (err) {
    console.error("Evaluation error:", err);
    return fallbackEvaluation(qa);
  }
};



const fallbackEvaluation = (qa) => {
  return {
    clarity: 6,
    relevance: 6,
    reasoning: 6,

    strengths: ["Basic understanding of concepts"],
    weaknesses: ["Answers lack depth"],
    improvements: ["Provide detailed explanations"],

    detailedFeedback: qa.map((item) => ({
      question: item.question,
      feedback:
        item.answer.length > 30
          ? "Decent answer but can be more structured"
          : "Too short, lacks explanation",
      score: item.answer.length > 30 ? 7 : 5,
    })),
  };
};