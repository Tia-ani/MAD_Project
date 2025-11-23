import User from "../models/User.js";

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create or update user profile
export const createOrUpdateProfile = async (req, res) => {
  try {
    const { email, name, phone, profilePicture, accessibilityPreferences } = req.body;

    if (!email || !name) {
      return res.status(400).json({ message: "Email and name are required" });
    }

    const user = await User.findOneAndUpdate(
      { email },
      {
        email,
        name,
        phone,
        profilePicture,
        accessibilityPreferences,
        updatedAt: Date.now()
      },
      { 
        upsert: true, 
        new: true,
        setDefaultsOnInsert: true
      }
    );

    res.json({
      message: "Profile updated successfully",
      user
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add favorite station
export const addFavoriteStation = async (req, res) => {
  try {
    const { email } = req.params;
    const { stationId } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.favoriteStations.includes(stationId)) {
      user.favoriteStations.push(stationId);
      await user.save();
    }

    res.json({
      message: "Station added to favorites",
      user
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove favorite station
export const removeFavoriteStation = async (req, res) => {
  try {
    const { email } = req.params;
    const { stationId } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.favoriteStations = user.favoriteStations.filter(id => id !== stationId);
    await user.save();

    res.json({
      message: "Station removed from favorites",
      user
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get user's reported issues
export const getUserReports = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.reportedIssues || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add reported issue to user profile
export const addReportedIssue = async (req, res) => {
  try {
    const { email } = req.params;
    const { stationId, stationName, issue, severity } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.reportedIssues.push({
      stationId,
      stationName,
      issue,
      severity,
      reportedAt: Date.now()
    });

    await user.save();

    res.json({
      message: "Issue report added to profile",
      user
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



