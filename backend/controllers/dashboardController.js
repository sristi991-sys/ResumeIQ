import Evaluation from "../models/evaluation.js";

export const getDashboardStats = async (req, res) => {
  try {
    const total = await Evaluation.countDocuments();

    const selected = await Evaluation.countDocuments({
      decision: "Selected",
    });

    const rejected = await Evaluation.countDocuments({
      decision: "Rejected",
    });

    const avgData = await Evaluation.aggregate([
      {
        $group: {
          _id: null,
          avgScore: { $avg: "$finalScore" },
          avgFairness: { $avg: "$fairnessScore" },
        },
      },
    ]);

    const avgScore = avgData[0]?.avgScore || 0;
    const avgFairness = avgData[0]?.avgFairness || 1;

    res.status(200).json({
      totalCandidates: total,
      selected,
      rejected,
      avgScore: Number(avgScore.toFixed(2)),
      avgFairness: Number(avgFairness.toFixed(2)),
    });
  } catch (error) {
    console.error("🔥 ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch dashboard stats",
      error: error.message,
    });
  }
};

export const getAllCandidates = async (req, res) => {
  try {
    const Candidate = (await import("../models/candidate.js")).default;
    
    const candidates = await Candidate.find()
      .sort({ createdAt: -1 })
      .select("name email phone linkedin role atsScore atsDecision status anonId createdAt");

    res.status(200).json({
      count: candidates.length,
      data: candidates,
    });
  } catch (error) {
    console.error("🔥 ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch candidates",
      error: error.message,
    });
  }
};

export const getCandidateById = async (req, res) => {
  try {
    const { id } = req.params;

    const candidate = await Evaluation.findById(id);

    if (!candidate) {
      return res.status(404).json({
        message: "Candidate not found",
      });
    }

    res.status(200).json({
      data: candidate,
    });
  } catch (error) {
    console.error("🔥 ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch candidate",
      error: error.message,
    });
  }
};

export const deleteCandidateById = async (req, res) => {
  try {
    const { id } = req.params;
    const Candidate = (await import("../models/candidate.js")).default;
    
    // Delete candidate
    await Candidate.findByIdAndDelete(id);
    
    // Also delete associated evaluations
    await Evaluation.deleteMany({ candidateId: id });

    res.status(200).json({ success: true, message: "Candidate deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteAllCandidates = async (req, res) => {
  try {
    const Candidate = (await import("../models/candidate.js")).default;
    
    // Clear all candidates
    await Candidate.deleteMany({});
    
    // Clear all evaluations
    await Evaluation.deleteMany({});

    res.status(200).json({ success: true, message: "All candidates and evaluations cleared" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};