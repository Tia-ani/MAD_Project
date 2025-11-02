import Report from "../models/Report.js";

export const createReport = async (req, res) => {
  try {
    const { stationId, issue, severity } = req.body;

    if (!stationId || !issue)
      return res.status(400).json({ message: "Missing required fields" });

    const newReport = await Report.create({
      stationId,
      issue,
      severity,
      reportedBy: req.user?.uid || "anonymous",
    });

    res.status(201).json(newReport);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getReportsForStation = async (req, res) => {
  try {
    const reports = await Report.find({ stationId: req.params.stationId });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
