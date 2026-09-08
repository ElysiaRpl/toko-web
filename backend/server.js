// backend/server.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

require("./config/db");

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173"
}));
app.use(express.json());

// Serve static files dari folder uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Import routes
const userRoutes = require("./routes/users");
const adminRoutes = require("./routes/admin");

// Gunakan routes
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("API jalan");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server jalan di port ${PORT}`);
});