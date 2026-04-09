export const extractJSON = (text) => {
  try {
    const match = text.match(/\{[\s\S]*\}/);

    if (!match) {
      console.error("❌ Raw AI Output:", text);
      throw new Error("Invalid JSON from AI");
    }

    return JSON.parse(match[0]);
  } catch (err) {
    console.error("🔥 JSON Parse Error:", err.message);
    console.error("📦 Raw Response:", text);

    throw new Error("AI returned invalid JSON");
  }
};