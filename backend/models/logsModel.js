import mongoose from "mongoose";

const logsSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
    },

    
    rawAnswers: [String],

    
    aiRaw: String,

    
    finalEvaluation: {
      clarity: Number,
      relevance: Number,
      reasoning: Number,
      finalScore: Number,
      decision: String,
    },

    
    biasInfo: {
      biasAdjusted: Boolean,
      fairnessScore: Number,
      flags: {
        gender: Boolean,
        college: Boolean,
        name: Boolean,
      },
    },

    
    role: String,
    anonId: String,

    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Logs", logsSchema);