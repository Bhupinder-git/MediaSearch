// Import dependencies
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const authRoutes = require("./routes/auth");
const collectionRoutes = require("./routes/collection");

// Import environment variables
require("dotenv").config();

// Import database connection
const dbConnect = require("./config/dbConnect");

// Import controllers
const {
  signup,
  login,
  logout,
  getMe,
  getCollection,
  addToCollection,
  removeFromCollection,
} = require("./controllers/user");

// Import middleware
const authentication = require("./middlewares/authentication");

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 4000;

// ===== Middlewares =====

// CORS — allow requests from any origin, including credentialed requests.
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Parse JSON bodies
app.use(express.json());

// Parse cookies
app.use(cookieParser());

// HTTP request logger
app.use(morgan("dev"));

// ===== Routes =====

// Health check
const healthCheck = (req, res) => {
  res.status(200).json({ success: true, message: "Server is running." });
};

app.get("/health", healthCheck);
app.get("/api/health", healthCheck);

// Auth routes (public)
app.use("/api/auth", authRoutes);

// Collection routes (protected)
app.use("/api/collection", collectionRoutes);

// ===== Start Server =====
async function startServer() {
  // Connect to MongoDB
  await dbConnect();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

startServer();
