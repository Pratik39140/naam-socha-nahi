import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const queueFile = path.join(__dirname, '..', 'queue.json');


router.get('/queue', (req, res) => {
  let data;
  try {
    const raw = fs.readFileSync(queueFile, 'utf8');
    data = JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load queue file:', err);
    return res.status(500).json({ error: 'Queue storage error' });
  }

  // Optionally sort by queue position for readability
  const jobs = [...data.jobs].sort((a, b) => {
    const ap = a.queuePosition ?? Infinity;
    const bp = b.queuePosition ?? Infinity;
    return ap - bp;
  });

  res.json({ jobs });
});

export default router;
