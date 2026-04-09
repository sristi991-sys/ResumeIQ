import mongoose from "mongoose";

const statusSchema = new mongoose.Schema({
  candidateId: String,
  status: String,
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Status", statusSchema);