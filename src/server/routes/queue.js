import express from "express";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { fileURLToPath } from "url";

const router = express.Router();

// __dirname replacement for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const QUEUE_FILE = path.join(__dirname, "../../../data/queue.json");

// const JWT_SECRET = process.env.JWT_SECRET;
// const DEMO_MODE = process.env.DEMO_MODE === "true";

// GET /queue/user
// GET /queue/user
router.get("/queue/user", (req, res) => {
  try {
    let jobs = [];
    // console.log("QUEUE USER QUEUE_FILE:", path.resolve(QUEUE_FILE));
    if (fs.existsSync(QUEUE_FILE)) {
      const raw = fs.readFileSync(QUEUE_FILE, "utf-8").trim();
      if (raw) {
        jobs = JSON.parse(raw);
      }
    }

    // 🔧 AUTH DISABLED: return all jobs for now
    jobs.sort((a, b) => a.createdAt - b.createdAt);

    return res.json(jobs);
  } catch (err) {
    console.error("GET /queue/user error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});



export default router;
