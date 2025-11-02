import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import stationRoutes from "./routes/stationRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/stations", stationRoutes);

app.get("/", (req, res) => {
  res.send("🚆 Inclusive Public Transit Navigator Backend is running!");
});

const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
