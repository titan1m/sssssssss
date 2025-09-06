import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(path.resolve(), '/public'))); 
// Note: move all HTML/CSS files into /public folder

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Example Schema for stored texts
const dataSchema = new mongoose.Schema({
  step: String,
  text: String,
  date: { type: Date, default: Date.now }
});

const Data = mongoose.model("Data", dataSchema);

// Routes
app.post("/save", async (req, res) => {
  try {
    const { step, text } = req.body;
    const data = new Data({ step, text });
    await data.save();
    res.status(200).json({ message: "Data saved successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save data." });
  }
});

// Test route
app.get("/test", (req, res) => res.send("Server is running!"));

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
