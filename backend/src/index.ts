import cors from "cors";
import express from "express";

const app = express();

app.use(cors());

const PORT = 3000;

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "File Fusion backend is running"
  });
});

app.get("/api/files", (req, res) => {
    res.json([
      {
        id: 1,
        name: "document.pdf",
        type: "PDF"
      },
      {
        id: 2,
        name: "report.docx",
        type: "DOCX"
      }
    ]);
});

app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
  });