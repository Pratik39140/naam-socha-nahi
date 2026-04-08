import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// __dirname replacement for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const QUEUE_FILE = path.join(__dirname, "../../../data/queues.json");

// Helpers
function readQueue() {
  try {
    if (!fs.existsSync(QUEUE_FILE)) {
      const emptyQueue = { global: [], users: {} };
      fs.writeFileSync(QUEUE_FILE, JSON.stringify(emptyQueue, null, 2));
      return emptyQueue;
    }
    const data = fs.readFileSync(QUEUE_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("ERROR reading queue file:", err);
    return { global: [], users: {} };
  }
}

function writeQueue(data) {
  fs.writeFileSync(QUEUE_FILE, JSON.stringify(data, null, 2));
}

// ✅ Upload endpoint → adds to both global + user queue
router.post("/api/upload", (req, res) => {
  try {
    const { username, fileName, pageRanges, colorMode } = req.body;
    if (!username || !fileName) {
      return res.status(400).json({ error: "Missing username or fileName" });
    }

    const queues = readQueue();
    const newJob = {
      jobId: Date.now().toString(),
      userId: username,
      fileName,
      pageRanges,
      colorMode,
      status: "pending-payment",
      createdAt: Date.now(),
    };

    // Add to global queue
    queues.global.push(newJob);

    // Add to user queue
    if (!queues.users[username]) {
      queues.users[username] = [];
    }
    newJob.queuePosition = queues.users[username].length + 1;
    queues.users[username].push(newJob);

    writeQueue(queues);
    return res.json({ success: true, job: newJob });
  } catch (err) {
    console.error("POST /api/upload error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});


// ✅ Get global queue
router.get("/api/queue/global", (req, res) => {
  try {
    const queues = readQueue();
    const jobs = queues.global || [];
    jobs.sort((a, b) => a.createdAt - b.createdAt);
    return res.json(jobs);
  } catch (err) {
    console.error("GET /api/queue/global error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Get individual user queue
router.get("/api/queue/:username", (req, res) => {
  try {
    const { username } = req.params;
    const queues = readQueue();
    const jobs = queues.users[username] || [];
    jobs.sort((a, b) => a.createdAt - b.createdAt);
    return res.json(jobs);
  } catch (err) {
    console.error("GET /api/queue/:username error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});



export default router;
