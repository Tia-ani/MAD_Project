import Station from "../models/Station.js";

// Get all stations
export const getAllStations = async (req, res) => {
  try {
    const stations = await Station.find();
    res.json(stations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a specific station by ID
export const getStationById = async (req, res) => {
  try {
    const station = await Station.findOne({ id: req.params.id });
    if (!station) return res.status(404).json({ message: "Station not found" });
    res.json(station);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Report a new accessibility issue for a station
export const reportIssue = async (req, res) => {
  try {
    const { id } = req.params; // station ID from URL
    const { issue, severity } = req.body; // sent from frontend

    if (!issue || !severity) {
      return res.status(400).json({ message: "Issue and severity are required" });
    }

    const station = await Station.findOne({ id });
    if (!station) return res.status(404).json({ message: "Station not found" });

    // Add new issue to the station’s issues array
    const issueEntry = `${issue} (${severity} severity)`;
    station.issues.push(issueEntry);
    await station.save();

    res.status(201).json({
      message: "Issue reported successfully!",
      station,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
