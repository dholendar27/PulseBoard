import express from "express";
import cookieParser from "cookie-parser";
import { authRouter } from "./routes/auth.js";
import { incidentRouter } from "./routes/incidents.js";
import cors from "cors";
import "dotenv/config";

export const app = express();

app.use(cors({ 
  origin: ["http://localhost:3000", "http://localhost:5173", "http://localhost:3001"], 
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
}));
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/incident", incidentRouter);
