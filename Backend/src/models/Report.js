import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    stationId: { type: String, required: true },
    issue: { type: String, required: true },
    severity: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    reportedBy: String, // Firebase UID (optional)
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Report", reportSchema);
