import express from "express";
import { createReport, getReportsForStation } from "../controllers/reportController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Allow anonymous users for now (you can add verifyToken later)
router.post("/", createReport);
router.get("/:stationId", getReportsForStation);

export default router;
