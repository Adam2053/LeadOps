import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import dbConnection from "./db/dbConnection.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

// routes
app.use("/api/v1/auth", authRoutes);

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  dbConnection(MONGO_URL);
});
