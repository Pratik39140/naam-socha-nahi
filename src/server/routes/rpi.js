import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import trayState from './print.js'; // Import shared tray state

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const queueFile = path.join(__dirname, '../../../data', 'queues.json');

router.post("/rpi/otp/collect", (req, res) => {
  try {
    const { otp } = req.body;

    // ✅ Validate input
    if (!otp) {
      return res.status(400).json({ error: "OTP is required" });
    }

    const queue = readQueue();

    if (!queue.global || !Array.isArray(queue.global)) {
      return res.status(500).json({ error: "Invalid queue structure" });
    }

    // 🔍 Find job by OTP
    const job = queue.global.find(j => j.otp === otp);

    // ❌ Not found
    if (!job) {
      return res.status(400).json({ error: "Invalid or already used OTP" });
    }

    // ❌ Validate conditions
    if (job.status !== "done" || job.otpUsed) {
      return res.status(400).json({ error: "Invalid or already used OTP" });
    }

    // ✅ Valid → return minimal info
    return res.json({
      jobId: job.jobId,
      trayIndex: job.trayIndex
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post("/rpi/collect/done", (req, res) => {
  try {
    const { jobId } = req.body;

    // ✅ Validate input
    if (!jobId) {
      return res.status(400).json({ error: "jobId is required" });
    }

    const queue = readQueue();

    if (!queue.global || !Array.isArray(queue.global)) {
      return res.status(500).json({ error: "Invalid queue structure" });
    }

    // 🔍 Find job
    const job = queue.global.find(j => j.jobId === jobId);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    // ❌ Optional safety check
    if (job.status !== "done") {
      return res.status(400).json({ error: "Job is not ready for collection" });
    }

    // ✅ Free tray if exists
    if (typeof job.trayIndex === "number") {
      trayState[job.trayIndex] = false;
    }

    // ✅ Update job
    job.status = "collected";
    job.otpUsed = true;

    // 💾 Save
    writeQueue(queue);

    res.json({
      success: true,
      jobId: job.jobId,
      trayFreed: job.trayIndex
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;