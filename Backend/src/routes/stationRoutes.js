import express from "express";
import { getAllStations, getStationById, reportIssue } from "../controllers/stationController.js";
import upload from "../config/multer.js";

const router = express.Router();

router.get("/", getAllStations);
router.get("/:id", getStationById);
router.post("/:id/report", upload.single('image'), reportIssue);

export default router;
