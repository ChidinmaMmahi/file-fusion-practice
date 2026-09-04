import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import { authRouter } from "./routes/auth.js";
import { draftsRouter } from "./routes/drafts.js";

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: [clientOrigin, "http://127.0.0.1:5173"],
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

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
