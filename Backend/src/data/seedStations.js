import mongoose from "mongoose";
import dotenv from "dotenv";
import { stationsData } from "./stationsData.js";
import Station from "../models/Station.js";
import { connectDB } from "../config/db.js";

dotenv.config();

const seedStations = async () => {
  try {
    await connectDB();
    await Station.deleteMany();
    await Station.insertMany(stationsData);
    console.log("Stations seeded successfully!");
    mongoose.connection.close();
  } catch (err) {
    console.error("Error seeding stations:", err);
    mongoose.connection.close();
  }
};

seedStations();
