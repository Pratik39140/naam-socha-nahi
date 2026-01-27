import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import uploadRoute from "./routes/upload.js";
import paymentRoute from "./routes/payment.js";
import queueRoute from "./routes/queue.js";

const app = express();

// allow frontend to hit backend during development
app.use(cors());

// for JSON bodies
app.use(express.json());

// mount upload route (more routes can be added later)
app.use(uploadRoute);

app.use(paymentRoute);

app.use(queueRoute);

/**
 * ============================================
 * DEBUG: List uploaded files (temporary utility)
 * --------------------------------------------
 * - returns file names from ./data/files
 * - useful for testing uploads during dev
 * - remove or protect with auth in production!
 * ============================================
 */
app.get("/files", (req, res) => {
  const folder = "./data/files";

  try {
    if (!fs.existsSync(folder)) {
      return res.json([]); // no uploads yet
    }

    const files = fs.readdirSync(folder);
    return res.json(files);
  } catch (err) {
    console.error("FILES DEBUG ERROR:", err);
    return res.status(500).json({ error: "server error" });
  }
});

const PORT = 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend running on http://10.92.74.104:${PORT}`);
});
