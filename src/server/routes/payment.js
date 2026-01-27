import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const queueFile = path.join(__dirname, '..', 'queue.json');


router.post('/payment', (req, res) => {
  const { jobId } = req.body;
  if (!jobId) {
    return res.status(400).json({ error: 'jobId is required' });
  }

  // Load queue.json
  let data;
  try {
    const raw = fs.readFileSync(queueFile, 'utf8');
    data = JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load queue file:', err);
    return res.status(500).json({ error: 'Queue storage error' });
  }

  // Find job
  const job = data.jobs.find(j => j.id === jobId);
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  // Validate status
  if (job.status !== 'pending-payment') {
    return res.status(400).json({ error: `Job not in pending-payment state (current: ${job.status})` });
  }

  // Mark as paid then queued
  job.status = 'paid';
  job.status = 'queued';

  // Assign queuePosition based on FIFO: position = count of queued jobs before it + 1
  const queued = data.jobs.filter(j => j.status === 'queued' && j.queuePosition != null);
  const nextPosition = queued.length > 0
    ? Math.max(...queued.map(j => j.queuePosition)) + 1
    : 1;

  job.queuePosition = nextPosition;

  // Save
  try {
    fs.writeFileSync(queueFile, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Failed to write queue file:', err);
    return res.status(500).json({ error: 'Queue save error' });
  }

  res.json(job);
});

export default router;
