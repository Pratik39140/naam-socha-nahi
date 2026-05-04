import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// Fix __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Folder where files are stored
const DOWNLOAD_DIR = path.join(__dirname, "../../../data/files");

// GET /api/download/files/:jobid
router.get("/api/download/job/:jobid", (req, res) => {
  const { jobid } = req.params;

  if (!jobid) {
    return res.status(400).json({ error: "jobid is required" });
  }

  try {
    // Read all files in directory
    const files = fs.readdirSync(DOWNLOAD_DIR);

    // Match file starting with job_<jobid>
    const matchedFile = files.find((file) =>
      file.startsWith(`${jobid}`)
    );

    if (!matchedFile) {
      return res.status(404).json({ error: "File not found" });
    }

    const filePath = path.join(DOWNLOAD_DIR, matchedFile);

    // Optional: force download
    res.download(filePath, matchedFile, (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error downloading file");
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;