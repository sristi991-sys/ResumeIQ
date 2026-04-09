import Groq from "groq-sdk";

export const groqService = async (prompt) => {
  if (!process.env.GROQ_API_KEY) {
    console.log("⚠️ GROQ key missing → using fallback response");
    return JSON.stringify({
      clarity: 6,
      relevance: 6,
      reasoning: 6,
      strengths: ["Basic understanding"],
      weaknesses: ["Needs improvement"],
      improvements: ["Practice more"],
      detailedFeedback: [],
    });
  }

  
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const response = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.3-70b-versatile",
  });

  return response.choices[0].message.content;
};