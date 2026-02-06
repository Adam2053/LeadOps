import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import followUpCron from "./utils/followUpCron.js";
import authRoutes from "./routes/auth.routes.js";
import leadRoutes from "./routes/lead.routes.js";
import followUpRoutes from "./routes/followUp.routes.js";
import dbConnection from "./db/dbConnection.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/lead", leadRoutes);
app.use("/api/v1/followup", followUpRoutes);

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

const startServer = async () => {
  try {
    await dbConnection(MONGO_URL);
    followUpCron();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

startServer();
