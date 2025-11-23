import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  profilePicture: {
    type: String,
    default: null
  },
  accessibilityPreferences: {
    wheelchair: { type: Boolean, default: false },
    requiresElevator: { type: Boolean, default: false },
    audioAnnouncements: { type: Boolean, default: true },
    brailleSignage: { type: Boolean, default: false },
    tactilePaving: { type: Boolean, default: false },
  },
  favoriteStations: [{
    type: String, // Station IDs
    ref: 'Station'
  }],
  reportedIssues: [{
    stationId: String,
    stationName: String,
    issue: String,
    severity: String,
    reportedAt: { type: Date, default: Date.now }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("User", userSchema);



