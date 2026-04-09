import { groqService } from "./groqService.js";
import { extractJSON } from "../utils/parser.js";
import { ROLE_SKILLS } from "../utils/skills.js";

export const evaluateResume = async (resumeText, role) => {
  const skills = ROLE_SKILLS[role] || ["General Programming"];

  const prompt = `
You are a senior FAANG hiring manager.

Your task is to evaluate a candidate's resume for the role: ${role}

========================
RESUME:
${resumeText}
========================

JOB REQUIRED SKILLS:
${skills.join(", ")}

STRICT RULES:
- Evaluate ONLY based on skills and experience
- IGNORE name, gender, college, or background (avoid bias)
- Be realistic and critical (not overly positive)
- Output must be structured and professional
- Provide reasoning based ONLY on resume content

Return ONLY valid JSON in this format:

{
  "skillsExtracted": [],
  "matchedSkills": [],
  "missingSkills": [],
  "experienceLevel": "Beginner | Intermediate | Advanced",

  "scores": {
    "skillMatch": number,
    "experience": number,
    "projects": number,
    "finalScore": number
  },

  "decision": "Selected | Rejected | Borderline",

  "reason": "Detailed explanation of decision",

  "strengths": ["List of strengths based on resume"],
  "weaknesses": ["List of gaps or missing areas"],
  "improvements": ["Specific actionable improvements"]
}
`;

  const raw = await groqService(prompt);
  return extractJSON(raw);
};