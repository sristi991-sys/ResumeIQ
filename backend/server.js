import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";

import { connectDB } from "./config/db.js";


import questionRoutes from "./routes/questionRoutes.js";
import candidateRoutes from "./routes/candidateRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import roleRoutes from "./routes/roleRoutes.js";

const app = express();


app.use(cors());
app.use(express.json());


connectDB();


app.use("/api", questionRoutes);
app.use("/api", candidateRoutes);
app.use("/api", resumeRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/roles", roleRoutes);


app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});