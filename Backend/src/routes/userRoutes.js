import express from "express";
import {
  getUserProfile,
  createOrUpdateProfile,
  addFavoriteStation,
  removeFavoriteStation,
  getUserReports,
  addReportedIssue
} from "../controllers/userController.js";

const router = express.Router();

// Profile routes
router.get("/:email", getUserProfile);
router.put("/:email", createOrUpdateProfile);
router.post("/:email/favorites", addFavoriteStation);
router.delete("/:email/favorites", removeFavoriteStation);
router.get("/:email/reports", getUserReports);
router.post("/:email/reports", addReportedIssue);

export default router;



