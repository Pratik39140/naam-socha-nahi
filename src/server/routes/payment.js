import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const queueFile = path.join(__dirname, '../../../data', 'queue.json');

router.post('/payment/user', (req, res) => {
  const { jobId } = req.body;

  if (!jobId) {
    return res.status(400).json({ error: 'jobId is required' });
  }

  // Load queue.json
  let jobs;
  try {
    const raw = fs.readFileSync(queueFile, 'utf8');
    jobs = JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load queue file:', err);
    return res.status(500).json({ error: 'Queue storage error' });
  }

  if (!Array.isArray(jobs)) {
    return res.status(500).json({ error: 'Invalid queue structure' });
  }

  // Find job
  const job = jobs.find(j => j.jobId === jobId);

  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  // Ensure correct status
  if (job.status !== 'pending-payment') {
    return res.status(400).json({
      error: `Job not in pending-payment state (current: ${job.status})`
    });
  }

  // Calculate price
  const pages = job.pageRanges.length;
  const pricePerPage = job.colorMode === 'bw' ? 2 : 7;
  const calculatedPrice = pages * pricePerPage;

  // FIFO Queue Position Logic
  const queuedJobs = jobs.filter(
    j => j.status === 'queued' && typeof j.queuePosition === 'number'
  );

  const nextPosition =
    queuedJobs.length > 0
      ? Math.max(...queuedJobs.map(j => j.queuePosition)) + 1
      : 1;

  // Update job
  job.status = 'queued';
  job.queuePosition = nextPosition;
  job.paidAt = Date.now();
  job.price = calculatedPrice;

  // Save updated queue
  try {
    fs.writeFileSync(queueFile, JSON.stringify(jobs, null, 2));
  } catch (err) {
    console.error('Failed to write queue file:', err);
    return res.status(500).json({ error: 'Queue save error' });
  }

  return res.json(job);
});

export default router;
