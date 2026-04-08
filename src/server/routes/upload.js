import { Router } from "express";
import multer from "multer";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// temp folder for multer before renaming
const upload = multer({ dest: "./data/tmp" });

// helper to parse page ranges like "1-3,5,8"
function parsePageRanges(input) {
  return input
    .split(",")
    .map(part => part.trim())
    .filter(Boolean)
    .flatMap(part => {
      if (part.includes("-")) {
        const [start, end] = part.split("-").map(n => parseInt(n, 10));
        if (!Number.isFinite(start) || !Number.isFinite(end) || start > end) return [];
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
      }
      const n = parseInt(part, 10);
      return Number.isFinite(n) ? [n] : [];
    });
}

const QUEUE_FILE = path.join(__dirname, "../../../data/queues.json");

router.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    console.log("=== UPLOAD REQUEST RECEIVED ===");
    console.log("File:", req.file?.originalname);
    console.log("Body:", req.body);
    console.log("Username:", req.body.username);

    // extract jwt (optional for now)
    const token = req.headers.authorization?.replace("Bearer ", "");
    const decoded = token ? jwt.decode(token) : null;

    // Get username from form data first, then fallback to JWT
    let userId = req.body.username || decoded?.userId;

    // Log for debugging
    if (!userId) {
      console.warn("WARNING: No username found. Using 'guest' as fallback.");
      console.log("Request body:", req.body);
      console.log("Decoded JWT:", decoded);
    }

    userId = userId || "guest";

    // fields
    const file = req.file;
    const pageRangesStr = req.body.pageRanges?.trim();
    const colorMode = req.body.colorMode || "bw";

    if (!file) return res.status(400).json({ error: "file required" });
    if (!pageRangesStr) return res.status(400).json({ error: "pageRanges required" });

    const pageRanges = parsePageRanges(pageRangesStr);
    if (pageRanges.length === 0) {
      return res.status(400).json({ error: "invalid pageRanges" });
    }

    const jobId = `JOB_${Date.now()}`;
    const ext = path.extname(file.originalname);
    const finalFolder = "./data/files";
    const finalPath = path.join(finalFolder, jobId + ext);

    fs.mkdirSync(finalFolder, { recursive: true });
    fs.renameSync(file.path, finalPath);

    let queues = { global: [], users: {} };
    if (fs.existsSync(QUEUE_FILE)) {
      try {
        const raw = fs.readFileSync(QUEUE_FILE, "utf-8").trim();
        if (raw) queues = JSON.parse(raw);
      } catch (parseErr) {
        console.error("ERROR parsing queue file:", parseErr);
        // Start fresh if file is corrupted
        queues = { global: [], users: {} };
      }
    }

    if (!queues.users[userId]) {
      queues.users[userId] = [];
    }

    const job = {
      jobId,
      userId,
      filePath: finalPath,
      fileName: jobId + ext,
      pageRanges,
      colorMode,
      status: "pending-payment",
      createdAt: Date.now()
    };

    queues.global.push(job);
    queues.users[userId].push(job);

    fs.writeFileSync(QUEUE_FILE, JSON.stringify(queues, null, 2));

    return res.json({
      jobId,
      status: "pending-payment",
      userId,
      colorMode,
      fileName: jobId + ext
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return res.status(500).json({ error: "server error" });
  }
});

export default router;
