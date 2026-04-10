import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import { trayState } from "./print.js";

const router = express.Router();

// __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const QUEUE_FILE = path.join(__dirname, "../../../data/queues.json");

// ==============================
// 🧩 HELPERS (SAME AS PRINT FILE)
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

// ==============================
// 🔐 OTP VERIFY
// ==============================

router.post("/api/rpi/otp/collect", (req, res) => {
  try {
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({ error: "OTP is required" });
    }

    const queue = readQueue();

    if (!queue.global || !Array.isArray(queue.global)) {
      return res.status(500).json({ error: "Invalid queue structure" });
    }

    // ✅ SAFE MATCH (trim + string)
    const job = queue.global.find(
      j => String(j.otp).trim() === String(otp).trim()
    );

    if (!job) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    if (job.status !== "done") {
      return res.status(400).json({ error: "Job not ready" });
    }

    if (job.otpUsed) {
      return res.status(400).json({ error: "OTP already used" });
    }

    if (typeof job.trayIndex !== "number") {
      return res.status(400).json({ error: "Tray not assigned" });
    }

    return res.json({
      jobId: job.jobId,
      trayIndex: job.trayIndex
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==============================
// 📦 COLLECTION COMPLETE
// ==============================

router.post("/api/rpi/collect/done", (req, res) => {
  try {
    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({ error: "jobId is required" });
    }

    const queue = readQueue();

    // 🔍 Find job in global
    const job = queue.global.find(j => j.jobId === jobId);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    if (job.status !== "done") {
      return res.status(400).json({ error: "Job not ready for collection" });
    }

    // ✅ Free tray
    if (typeof job.trayIndex === "number") {
      trayState[job.trayIndex] = false;
    }

    // ✅ Update GLOBAL job
    job.status = "collected";
    job.otpUsed = true;
    job.collectedAt = Date.now();

    // 🔥 ALSO UPDATE USER-SPECIFIC COPY
    const userJobs = queue.users[job.userId];

    if (Array.isArray(userJobs)) {
      const userJob = userJobs.find(j => j.jobId === jobId);

      if (userJob) {
        userJob.status = "collected";
        userJob.otpUsed = true;
        userJob.collectedAt = job.collectedAt; // keep consistent timestamp
      }
    }

    writeQueue(queue);

    res.json({
      success: true,
      jobId: job.jobId
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;