import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import os from "os";
import CryptoJS from "crypto-js";
import { fileURLToPath } from "url";

import uploadRoute from "./upload.js";
import paymentRoute from "./payment.js";
import queueRoute from "./queue.js";

const app = express();

// =============================
// helpers to resolve paths (ESM)
// =============================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const usersFile = path.join(__dirname, "users.json");
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

// Helper: read users
 function readUsers() {
 if (!fs.existsSync(usersFile))  return [];
 const data = fs.readFileSync(usersFile);
 return JSON.parse(data);
 }

 // Helper: write users
 function writeUsers(users) {
 fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
 }

// Signup endpoint
 app.post("/signup", (req, res) => {
 const { username, email, password } = req.body;
 if (!username || !email || !password) {
 return res.status(400).json({ success: false, message: "Missing fields" });
  }

   const users = readUsers();
   if (users.find((u) => u.username === username)) {
   return res.status(400).json({ success: false, message: "User already exists" });
   }
    const encryptedPassword = CryptoJS.SHA256(password).toString();
    users.push({ username, email, password: encryptedPassword });
    writeUsers(users);

    res.json({ success: true, token: "mock-token-" + Date.now() }); });

    // Login endpoint
    app.post("/login", (req, res) => {
    const { username, password } = req.body;
    const encryptedPassword = CryptoJS.SHA256(password).toString();

    const users = readUsers();
    const user = users.find( (u) => u.username === username && u.password === encryptedPassword );

    if (user) {
    return res.json({ success: true, token: "mock-token-" + Date.now() });
     }
     else {
     return res.status(401).json({ success: false, message: "Invalid credentials" });
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
const PORT = 5000;

app.listen(PORT, "0.0.0.0", () => {
  const ip = getLocalIP();

  console.log("=================================");
  console.log(" Server running!");
  console.log(` Local:   http://localhost:${PORT}`);
  console.log(` Network: http://${ip}:${PORT}/naam-socha-nahi`);
  console.log(" Open Network URL on your phone");
  console.log("=================================");
});
