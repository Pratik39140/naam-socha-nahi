import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
// Optional (better OTP)
import crypto from 'crypto';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const queueFile = path.join(__dirname, '../../../data', 'queues.json');

router.post('/payment/user', (req, res) => {
  const { jobId } = req.body;

  if (!jobId) {
    return res.status(400).json({ error: 'jobId is required' });
  }

  let data;
  try {
    const raw = fs.readFileSync(queueFile, 'utf8');
    data = JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load queue file:', err);
    return res.status(500).json({ error: 'Queue storage error' });
  }

  if (!data.global || !Array.isArray(data.global)) {
    return res.status(500).json({ error: 'Invalid queue structure' });
  }

  // 🔍 Find job in global
  const job = data.global.find(j => j.jobId === jobId);

  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  if (job.status !== 'pending-payment') {
    return res.status(400).json({
      error: `Job not in pending-payment state (current: ${job.status})`
    });
  }

  // 💰 Calculate price
  const pages = job.pageRanges.length;
  const pricePerPage = job.colorMode === 'bw' ? 2 : 7;
  const calculatedPrice = pages * pricePerPage;

  // 🔐 Generate 6-digit OTP
  //const otp = Math.floor(100000 + Math.random() * 900000).toString();
  // Better version:
  const otp = crypto.randomInt(100000, 1000000).toString();

  // 📌 Queue position (from global)
  const queuedJobs = data.global.filter(
    j => j.status === 'queued' && typeof j.queuePosition === 'number'
  );

  const nextPosition =
    queuedJobs.length > 0
      ? Math.max(...queuedJobs.map(j => j.queuePosition)) + 1
      : 1;

  // ✏️ Update global job
  job.status = 'queued';
  job.queuePosition = nextPosition;
  job.paidAt = Date.now();
  job.price = calculatedPrice;

  // 🔐 OTP fields
  job.otp = otp;
  job.otpUsed = false;

  // 🔁 ALSO update user-specific copy
  if (data.users && data.users[job.userId]) {
    const userJobs = data.users[job.userId];
    const userJob = userJobs.find(j => j.jobId === jobId);

    if (userJob) {
      userJob.status = 'queued';
      userJob.queuePosition = nextPosition;
      userJob.paidAt = job.paidAt;
      userJob.price = calculatedPrice;

      // 🔐 OTP fields
      userJob.otp = otp;
      userJob.otpUsed = false;
    }
  }

  // 💾 Save
  try {
    fs.writeFileSync(queueFile, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Failed to write queue file:', err);
    return res.status(500).json({ error: 'Queue save error' });
  }

  // 📤 Return job + OTP
  return res.json({
    ...job,
    otp
  });
});

export default router;