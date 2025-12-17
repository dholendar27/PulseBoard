import express from "express";
import cookieParser from "cookie-parser";
import {authRouter} from "./routes/auth.js";
import {incidentRouter} from "./routes/incidents.js";
import "dotenv/config"

export const app = express();

app.use(express.json())
app.use(cookieParser())

app.use("/", authRouter)
app.use("/incident", incidentRouter)
