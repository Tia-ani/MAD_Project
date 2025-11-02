import mongoose from "mongoose";

const stationSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  name: String,
  coords: {
    latitude: Number,
    longitude: Number,
  },
  description: String,
  accessibility: {
    wheelchair: Boolean,
    elevators: Boolean,
    tactilePaving: Boolean,
    audioAnnouncements: Boolean,
    brailleSignage: Boolean,
  },
  issues: [String], // initial known issues
});

export default mongoose.model("Station", stationSchema);
