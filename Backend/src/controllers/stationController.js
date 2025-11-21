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
    const imageFile = req.file; // image file from multer

    if (!issue || !severity) {
      return res.status(400).json({ message: "Issue and severity are required" });
    }

    const station = await Station.findOne({ id });
    if (!station) return res.status(404).json({ message: "Station not found" });

    // Add new issue to the station's issues array
    const issueEntry = `${issue} (${severity} severity)`;
    station.issues.push(issueEntry);
    
    // Store image path if image was uploaded
    let imagePath = null;
    if (imageFile) {
      imagePath = `/uploads/${imageFile.filename}`;
      // You can also store this in the station model if needed
      // For now, we'll include it in the response
    }
    
    await station.save();

    res.status(201).json({
      message: "Issue reported successfully!",
      station,
      imagePath: imagePath, // Return image path if uploaded
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
