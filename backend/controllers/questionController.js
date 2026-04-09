import { generateQuestions } from "../services/questionService.js";

export const getQuestions = async (req, res) => {
  try {
    let { role } = req.body;

    
    if (!role || typeof role !== "string" || role.trim() === "") {
      return res.status(400).json({
        message: "Role is required and must be a valid string",
      });
    }

    
    role = role.trim();

    
    const result = await generateQuestions(role);

    
    if (!result || !result.questions) {
      return res.status(500).json({
        message: "Failed to generate valid questions",
      });
    }

    
    res.status(200).json({
      message: "Questions generated successfully",
      data: result.questions.map((q, i) => ({
        id: i + 1,
        question: typeof q === "string" ? q : q.question,
        skill: typeof q === "object" ? (q.skill || "General") : "General",
        difficulty: typeof q === "object" ? (q.difficulty || "Medium") : "Medium",
      }))
    });

  } catch (error) {
    console.error("🔥 ERROR:", error);

    res.status(500).json({
      message: "Error generating questions",
      error: error.message,
    });
  }
};