import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import os from "os";
import { fileURLToPath } from "url";

import uploadRoute from "./routes/upload.js";
import paymentRoute from "./routes/payment.js";
import queueRoute from "./routes/queue.js";

const app = express();

// =============================
// helpers to resolve paths (ESM)
// =============================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =============================
// middleware
// =============================
app.use(cors());
app.use(express.json());

// =============================
// API routes
// =============================
app.use(uploadRoute);
app.use('/api', paymentRoute);
app.use(queueRoute);


// =============================
// DEBUG route (optional)
// =============================
app.get("/files", (req, res) => {
  const folder = "./data/files";

  try {
    if (!fs.existsSync(folder)) return res.json([]);
    const files = fs.readdirSync(folder);
    return res.json(files);
  } catch (err) {
    console.error("FILES DEBUG ERROR:", err);
    return res.status(500).json({ error: "server error" });
  }
});

// =============================
// SERVE FRONTEND BUILD
// =============================
const FRONTEND_PATH = path.join(__dirname, "../../dist");

app.use("/naam-socha-nahi", express.static(FRONTEND_PATH));

app.use("/naam-socha-nahi", (req, res) => {
  res.sendFile(path.join(FRONTEND_PATH, "index.html"));
});


// =============================
// get LAN IP helper (for console)
// =============================
function getLocalIP() {
  const nets = os.networkInterfaces();
  for (const name in nets) {
    for (const net of nets[name] || []) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  return "localhost";
}

// =============================
// start server
// =============================
const PORT = 3000;

app.listen(PORT, "0.0.0.0", () => {
  const ip = getLocalIP();

  console.log("=================================");
  console.log(" Server running!");
  console.log(` Local:   http://localhost:${PORT}`);
  console.log(` Network: http://${ip}:${PORT}/naam-socha-nahi`);
  console.log(" Open Network URL on your phone");
  console.log("=================================");
});
