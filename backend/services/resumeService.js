import pdfParse from "pdf-parse";

export const parseResume = async (buffer) => {
  try {
    const data = await pdfParse(buffer);

    return {
      text: data.text || "",
      length: data.text ? data.text.length : 0,
    };
  } catch (error) {
    console.error("🔥 PDF Parse Error:", error);
    throw new Error("Failed to parse resume");
  }
};