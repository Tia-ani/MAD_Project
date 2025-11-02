import express from "express";
import { getAllStations, getStationById, reportIssue } from "../controllers/stationController.js";

const router = express.Router();

router.get("/", getAllStations);
router.get("/:id", getStationById);
router.post("/:id/report", reportIssue);

export default router;
