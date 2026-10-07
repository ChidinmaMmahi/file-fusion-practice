import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import { authRouter } from "./routes/auth.js";
import { draftsRouter } from "./routes/drafts.js";

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const clientOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: [...clientOrigins, "http://127.0.0.1:5173", "http://localhost:8080"],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json({ limit: "15mb" }));

app.get("/api/health", (_req, res) => {
  res.json({
    status: "OK",
    message: "File Fusion backend is running",
  });
});

app.use("/api/auth", authRouter);
app.use("/api/drafts", draftsRouter);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running on port ${PORT}`);
});
