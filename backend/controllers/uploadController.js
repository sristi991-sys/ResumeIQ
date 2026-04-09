import { parseResume } from "../services/resumeService.js";

export const uploadResume = async (req, res) => {
  try {
    
    if (!req.file) {
      return res.status(400).json({
        message: "No resume file uploaded",
      });
    }

    const file = req.file;

    
    if (file.mimetype !== "application/pdf") {
      return res.status(400).json({
        message: "Only PDF files are allowed",
      });
    }

    
    const resumeText = await parseResume(file.buffer);

    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({
        message: "Could not extract text from resume",
      });
    }

    
    res.status(200).json({
      message: "Resume uploaded and parsed successfully",

      data: {
        text: resumeText,
        length: resumeText.length,
      },
    });

  } catch (error) {
    console.error("🔥 Resume Upload Error:", error);

    res.status(500).json({
      message: "Error processing resume",
      error: error.message,
    });
  }
};