import { evaluateResume } from "../services/resumeEvaluationService.js";
import { applyBiasGuard } from "../services/biasGuardService.js";
import { parseResume } from "../services/resumeService.js";
import { buildResumeReport } from "../services/reportService.js";

export const evaluateResumeController = async (req, res) => {
  try {
    const { role } = req.body;

    if (!req.file) {
      return res.status(400).json({
        message: "Resume file is required",
      });
    }

    if (!role) {
      return res.status(400).json({
        message: "Role is required",
      });
    }

    
    const parsed = await parseResume(req.file.buffer);
    const resumeText = parsed.text;

    
    let evaluation = await evaluateResume(resumeText, role);

    
    evaluation = applyBiasGuard(evaluation, [resumeText]);

    
    const report = buildResumeReport(evaluation, role);

    res.status(200).json({
      message: "Resume evaluation completed",
      report,   
    });

  } catch (error) {
    console.error("🔥 Resume Eval Error:", error);
    res.status(500).json({ error: error.message });
  }
};