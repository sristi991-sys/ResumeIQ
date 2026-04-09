import { groqService } from "./groqService.js";
import { extractJSON } from "../utils/parser.js";
import { ROLE_SKILLS } from "../utils/skills.js";

export const generateQuestions = async (role) => {
  const skills = ROLE_SKILLS[role] || ["General Programming"];

const prompt = `
You are a senior technical interviewer.

Generate 5 interview questions for role: ${role}

STRICT RULES:
- Return ONLY valid JSON
- Do NOT add explanation text
- Do NOT add markdown
- Do NOT add comments

Return EXACTLY in this format:

{
  "questions": [
    {
      "skill": "string",
      "question": "string",
      "difficulty": "Easy | Medium | Hard"
    }
  ]
}
`;

  let raw;

  
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      raw = await groqService(prompt);
      const parsed = extractJSON(raw);

      
      if (
        parsed &&
        Array.isArray(parsed.questions) &&
        parsed.questions.length > 0
      ) {
        return parsed;
      }
    } catch (error) {
      console.warn(`⚠️ Question generation attempt ${attempt + 1} failed`);
    }
  }

  
  return {
    questions: [
      {
        skill: "General",
        question:
          "Explain a real-world project you worked on and the challenges you faced.",
      },
      {
        skill: "Problem Solving",
        question:
          "How would you approach debugging a failing production system?",
      },
      {
        skill: "Design",
        question:
          "Design a scalable system for handling large amounts of data.",
      },
      {
        skill: "Optimization",
        question:
          "How do you improve performance in an existing application?",
      },
      {
        skill: "Best Practices",
        question:
          "What coding practices do you follow to ensure maintainability?",
      },
    ],
  };
};