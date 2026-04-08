import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';

const router = express.Router();

// __dirname replacement for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const QUEUE_FILE = path.join(__dirname, "../../../data/queues.json");

// Helper: Read queue
function readQueue() {
  const data = fs.readFileSync(QUEUE_FILE, "utf-8");
  return JSON.parse(data);
}

// Helper: Write queue
function writeQueue(queue) {
  fs.writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2));
}

// Helper: Find job in global queue
function findJob(queue, jobId) {
  return queue.global.find(job => job.jobId === jobId);
}


// assuming helpers are already imported
// const { readQueue, writeQueue, findJob } = require("../utils/queueHelpers");


// ✅ GET /queue/next
router.get("/api/print/queue/next", (req, res) => {
  try {
    const queue = readQueue();

    // 🚫 Only ONE job at a time
    const isPrinting = queue.global.some(job => job.status === "printing");
    if (isPrinting) {
      return res.json(null);
    }

    // ✅ Find first queued job (no order change)
    const nextJob = queue.global.find(job => job.status === "queued");

    if (!nextJob) {
      return res.json(null);
    }

    res.json(nextJob);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ POST /print/start
router.post("/api/print/start", (req, res) => {
  try {
    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({ error: "jobId is required" });
    }

    const queue = readQueue();

    // 🚫 Prevent multiple printing jobs (extra safety)
    const isPrinting = queue.global.some(job => job.status === "printing");
    if (isPrinting) {
      return res.status(400).json({ error: "Another job is already printing" });
    }

    const job = findJob(queue, jobId);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    job.status = "printing";

    writeQueue(queue);

    res.json({ success: true, job });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ POST /print/done
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

    job.status = "done";

    writeQueue(queue);

    res.json({ success: true, job });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



export default router;