import React, { useEffect, useState } from "react";
import {
  Container, Stack, Typography, Button,
  CircularProgress, Box, Chip,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import RefreshIcon from "@mui/icons-material/Refresh";
import PrintIcon from "@mui/icons-material/Print";

type QueueJob = {
  jobId: string;
  userId: string;
  fileName: string;
  filePath: string;
  pageRanges: number[];
  colorMode: string;
  status: "pending-payment" | "queued" | "printing" | "done";
  createdAt: number;
  queuePosition?: number;
  otp?: string;
  otpUsed?: boolean;
};

const STATUS_CONFIG = {
  "pending-payment": { label: "Awaiting Payment", color: "#f59e0b", bg: "#f59e0b15", border: "#f59e0b30" },
  "queued":          { label: "In Queue",         color: "#3b82f6", bg: "#3b82f615", border: "#3b82f630" },
  "printing":        { label: "Printing",          color: "#14b8a6", bg: "#14b8a615", border: "#14b8a630" },
  "done":            { label: "Done",              color: "#22c55e", bg: "#22c55e15", border: "#22c55e30" },
};

const QueuePage: React.FC = () => {
  const [jobs, setJobs] = useState<QueueJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { username: paramUsername } = useParams<{ username: string }>();
  const navigate = useNavigate();

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const username = paramUsername || localStorage.getItem("username");
      if (!username) throw new Error("No username available");
      const res = await fetch(`/api/queue/${username}`);
      if (!res.ok) throw new Error("Failed to fetch queue");
      const data: QueueJob[] = await res.json();
      const sorted = [...data].sort((a, b) => {
        if (a.status === "queued" && b.status === "queued")
          return (a.queuePosition ?? 0) - (b.queuePosition ?? 0);
        return 0;
      });
      setJobs(sorted);
    } catch (err) {
      setError("Could not load queue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, [paramUsername]);

  const formatDate = (ts: number) => new Date(ts).toLocaleString();

  return (
    <Container maxWidth="sm" sx={{ py: 3, position: "relative", zIndex: 1 }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h6" sx={{ color: "#f1f5f9" }}>Print Queue</Typography>
          <Typography sx={{ fontSize: 12, color: "#475569", fontFamily: "'JetBrains Mono', monospace" }}>
            {jobs.length} job{jobs.length !== 1 ? "s" : ""} found
          </Typography>
        </Box>
        <Button
          variant="outlined"
          size="small"
          startIcon={<RefreshIcon sx={{ fontSize: 16 }} />}
          onClick={fetchJobs}
          sx={{
            borderColor: "#1e2d47", color: "#64748b", fontSize: 12,
            "&:hover": { borderColor: "#3b82f6", color: "#3b82f6", background: "#3b82f610" },
          }}
        >
          Refresh
        </Button>
      </Stack>

      {/* Loading */}
      {loading && (
        <Stack alignItems="center" py={6} gap={2}>
          <CircularProgress size={32} sx={{ color: "#3b82f6" }} />
          <Typography sx={{ fontSize: 13, color: "#475569" }}>Loading jobs…</Typography>
        </Stack>
      )}

      {/* Error */}
      {!loading && error && (
        <Box sx={{ p: 2, borderRadius: 2, background: "#ef444410", border: "1px solid #ef444430" }}>
          <Typography sx={{ color: "#ef4444", fontSize: 14 }}>{error}</Typography>
        </Box>
      )}

      {/* Empty */}
      {!loading && !error && jobs.length === 0 && (
        <Stack alignItems="center" py={8} gap={2}>
          <PrintIcon sx={{ fontSize: 48, color: "#1e2d47" }} />
          <Typography sx={{ color: "#475569", fontSize: 14 }}>No print jobs yet</Typography>
          <Button variant="contained" size="small" onClick={() => navigate("/main/upload")}>
            Upload a Document
          </Button>
        </Stack>
      )}

      {/* Job Cards */}
      <Stack spacing={2}>
        {!loading && jobs.map((job) => {
          const s = STATUS_CONFIG[job.status] ?? STATUS_CONFIG["queued"];
          return (
            <Box key={job.jobId} sx={{
              background: "#111827",
              border: "1px solid #1e2d47",
              borderRadius: 3,
              p: "20px",
              transition: "border-color 0.2s",
              "&:hover": { borderColor: "#334155" },
            }}>
              {/* Top row */}
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
                <Typography sx={{
                  fontWeight: 600, fontSize: 14, color: "#f1f5f9",
                  maxWidth: "65%", overflow: "hidden",
                  textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {job.fileName}
                </Typography>
                <Chip label={s.label} size="small" sx={{
                  fontSize: 11, height: 22, fontFamily: "'JetBrains Mono', monospace",
                  color: s.color, background: s.bg,
                  border: `1px solid ${s.border}`,
                  "& .MuiChip-label": { px: 1 },
                }} />
              </Stack>

              {/* Meta row */}
              <Stack direction="row" gap={2} mb={1.5} flexWrap="wrap">
                {[
                  ["Pages", job.pageRanges.length],
                  ["Mode", job.colorMode === "bw" ? "B&W" : "Color"],
                  ["ID", job.jobId.slice(0, 8) + "…"],
                  ["Date", formatDate(job.createdAt)],
                ].map(([k, v]) => (
                  <Box key={String(k)}>
                    <Typography sx={{ fontSize: 10, color: "#334155", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase" }}>{k}</Typography>
                    <Typography sx={{ fontSize: 12, color: "#94a3b8" }}>{v}</Typography>
                  </Box>
                ))}
              </Stack>

              {/* Queue position */}
              {job.status === "queued" && job.queuePosition != null && (
                <Box sx={{
                  display: "inline-flex", alignItems: "center", gap: 1,
                  background: "#3b82f610", border: "1px solid #3b82f620",
                  borderRadius: 1.5, px: 1.5, py: 0.5, mb: 1.5,
                }}>
                  <Typography sx={{ fontSize: 11, color: "#3b82f6", fontFamily: "'JetBrains Mono', monospace" }}>
                    Queue position #{job.queuePosition}
                  </Typography>
                </Box>
              )}

              {/* OTP Display */}
              {job.otp && (
                <Box sx={{
                  mt: 1.5, p: "14px 18px",
                  background: "#0b0f1a",
                  border: "1px solid #1e2d47",
                  borderRadius: 2,
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                  <Box>
                    <Typography sx={{ fontSize: 10, color: "#475569", fontFamily: "'JetBrains Mono', monospace", mb: 0.5 }}>
                      PICKUP CODE
                    </Typography>
                    <Typography sx={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 22, fontWeight: 700,
                      letterSpacing: "0.2em", color: "#3b82f6",
                    }}>
                      {job.otp}
                    </Typography>
                  </Box>
                  <Box sx={{
                    background: "#3b82f610", border: "1px solid #3b82f620",
                    borderRadius: 1.5, px: 1.5, py: 0.75,
                  }}>
                    <Typography sx={{ fontSize: 10, color: "#3b82f6", fontFamily: "'JetBrains Mono', monospace", textAlign: "center" }}>
                      SHOW AT<br />KIOSK
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Pay button */}
              {job.status === "pending-payment" && (
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={() => navigate(`/main/payment/${job.jobId}`)}
                >
                  Pay Now →
                </Button>
              )}
            </Box>
          );
        })}
      </Stack>
    </Container>
  );
};

export default QueuePage;
