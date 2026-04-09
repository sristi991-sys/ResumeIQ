import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      trim: true,
    },

    answers: {
      type: [String],
      required: true,
    },

    
    resumeText: {
      type: String,
      default: "",
    },

    
    anonId: {
      type: String,
      unique: true,
    },

    
    status: {
      type: String,
      enum: ["Pending", "Evaluated"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Candidate", candidateSchema);