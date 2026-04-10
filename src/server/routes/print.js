import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";

const router = express.Router();

// __dirname (ESM fix)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const QUEUE_FILE = path.join(__dirname, "../../../data/queues.json");

// 🧠 In-memory tray state
export const trayState = [false, false, false, false, false, false, false, false];
// false = free, true = occupied

// ==============================
// 🧩 HELPERS (SAFE)
// ==============================

function readQueue() {
  try {
    if (!fs.existsSync(QUEUE_FILE)) {
      return { global: [] };
    }

    const data = fs.readFileSync(QUEUE_FILE, "utf-8");
    return JSON.parse(data || "{}");
  } catch (err) {
    console.error("Read error:", err);
    return { global: [] };
  }
}

function writeQueue(queue) {
  try {
    fs.writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2));
  } catch (err) {
    console.error("Write error:", err);
  }
}

function findJob(queue, jobId) {
  return queue.global.find(j => j.jobId === jobId);
}

// ==============================
// 🚀 GET NEXT JOB
// ==============================

router.get("/api/print/queue/next", (req, res) => {
  try {
    const queue = readQueue();

    // 🚫 Only one job at a time
    const isPrinting = queue.global.some(j => j.status === "printing");
    if (isPrinting) return res.json(null);

    // ✅ Get first queued job
    const nextJob = queue.global.find(j => j.status === "queued");

    return res.json(nextJob || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==============================
// ▶️ START PRINT
// ==============================

router.post("/api/print/start", (req, res) => {
  try {
    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({ error: "jobId is required" });
    }

    const queue = readQueue();

    const isPrinting = queue.global.some(j => j.status === "printing");
    if (isPrinting) {
      return res.status(400).json({ error: "Another job is printing" });
    }

    const job = findJob(queue, jobId);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    if (job.status !== "queued") {
      return res.status(400).json({ error: "Job not in queued state" });
    }

    job.status = "printing";

    writeQueue(queue);

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==============================
// ✅ PRINT DONE
// ==============================

router.post("/api/print/done", (req, res) => {
  try {
    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({ error: "jobId is required" });
    }

    const queue = readQueue();
    const job = findJob(queue, jobId);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    if (job.status !== "printing") {
      return res.status(400).json({ error: "Job not in printing state" });
    }

    // 🔍 Find free tray
    const trayIndex = trayState.findIndex(t => t === false);

    if (trayIndex === -1) {
      return res.status(400).json({ error: "No trays available" });
    }

    // ✅ Occupy tray
    trayState[trayIndex] = true;

    // ✅ Update job (CRITICAL for OTP)
    job.status = "done";
    job.trayIndex = trayIndex;
    job.readyAt = Date.now();
    job.otpUsed = false; // ensure fresh

    writeQueue(queue);

    res.json({
      success: true,
      trayIndex
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;