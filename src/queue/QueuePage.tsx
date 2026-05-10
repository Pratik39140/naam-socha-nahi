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
  status: "pending-payment" | "queued" | "printing" | "done" | "collected";
  createdAt: number;
  queuePosition?: number;
  otp?: string;
  otpUsed?: boolean;
};

// ✅ Only define configs for active queue statuses
const STATUS_CONFIG: Record<
  Exclude<QueueJob["status"], "collected">,
  { label: string; color: string; bg: string; border: string }
> = {
  "pending-payment": { label: "Awaiting Payment", color: "#f59e0b", bg: "#f59e0b15", border: "#f59e0b30" },
  "queued":          { label: "In Queue",         color: "#F69E3D", bg: "#F69E3D15", border: "#F69E3D30" },
  "printing":        { label: "Printing",         color: "#14b8a6", bg: "#14b8a615", border: "#14b8a630" },
  "done":            { label: "Done",             color: "#22c55e", bg: "#22c55e15", border: "#22c55e30" },
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

      // ✅ Exclude collected jobs (they appear in History instead)
      const active = data.filter((job) => job.status !== "collected");

      // ✅ Sort queued jobs by queuePosition
      const sorted = [...active].sort((a, b) => {
        if (a.status === "queued" && b.status === "queued") {
          return (a.queuePosition ?? 0) - (b.queuePosition ?? 0);
        }
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
          <Typography variant="h6" sx={{ color: "#F2F2F2" }}>Print Queue</Typography>
          <Typography sx={{ fontSize: 12, color: "#B0B3B8", fontFamily: "'JetBrains Mono', monospace" }}>
            {jobs.length} job{jobs.length !== 1 ? "s" : ""} found
          </Typography>
        </Box>
        <Button variant="outlined" size="small"
          startIcon={<RefreshIcon sx={{ fontSize: 16 }} />}
          onClick={fetchJobs}
          sx={{ fontSize: 12 }}
        >
          Refresh
        </Button>
      </Stack>

      {/* Loading */}
      {loading && (
        <Stack alignItems="center" py={6} gap={2}>
          <CircularProgress size={32} />
          <Typography sx={{ fontSize: 13, color: "#B0B3B8" }}>Loading jobs…</Typography>
        </Stack>
      )}

      {/* Error */}
      {!loading && error && (
        <Box sx={{ p: 2, borderRadius: 2, background: "#D9302510", border: "1px solid #D9302530" }}>
          <Typography sx={{ color: "#D93025", fontSize: 14 }}>{error}</Typography>
        </Box>
      )}

      {/* Empty */}
      {!loading && !error && jobs.length === 0 && (
        <Stack alignItems="center" py={8} gap={2}>
          <PrintIcon sx={{ fontSize: 48, color: "#5E6266" }} />
          <Typography sx={{ color: "#B0B3B8", fontSize: 14 }}>No print jobs yet</Typography>
          <Button variant="contained" size="small" onClick={() => navigate("/main/upload")}>
            Upload a Document
          </Button>
        </Stack>
      )}

      {/* Job Cards */}
      <Stack spacing={2}>
        {!loading && jobs.map((job) => {
          // inside .map()
          const s = STATUS_CONFIG[job.status as Exclude<QueueJob["status"], "collected">];
          return (
            <Box key={job.jobId} sx={{
              background: "#373A3C", border: "1px solid #5E6266",
              borderRadius: 3, p: "20px",
              transition: "border-color 0.2s",
              "&:hover": { borderColor: "#9FA3A7" },
            }}>
              {/* Top row */}
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
                <Typography sx={{
                  fontWeight: 600, fontSize: 14, color: "#F2F2F2",
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
                    <Typography sx={{ fontSize: 10, color: "#5E6266", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase" }}>{k}</Typography>
                    <Typography sx={{ fontSize: 12, color: "#9FA3A7" }}>{v}</Typography>
                  </Box>
                ))}
              </Stack>

              {/* Queue position */}
              {job.status === "queued" && job.queuePosition != null && (
                <Box sx={{
                  display: "inline-flex", alignItems: "center", gap: 1,
                  background: "#F69E3D10", border: "1px solid #F69E3D20",
                  borderRadius: 1.5, px: 1.5, py: 0.5, mb: 1.5,
                }}>
                  <Typography sx={{ fontSize: 11, color: "#F69E3D", fontFamily: "'JetBrains Mono', monospace" }}>
                    Queue position #{job.queuePosition}
                  </Typography>
                </Box>
              )}

              {/* OTP Display */}
              {job.otp && (
                <Box sx={{
                  mt: 1.5, p: "14px 18px",
                  background: "#1A1A1A", border: "1px solid #5E6266",
                  borderRadius: 2,
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                  <Box>
                    <Typography sx={{ fontSize: 10, color: "#B0B3B8", fontFamily: "'JetBrains Mono', monospace", mb: 0.5 }}>
                      PICKUP CODE
                    </Typography>
                    <Typography sx={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 22, fontWeight: 700,
                      letterSpacing: "0.2em", color: "#F69E3D",
                    }}>
                      {job.otp}
                    </Typography>
                  </Box>
                  <Box sx={{
                    background: "#F69E3D10", border: "1px solid #F69E3D20",
                    borderRadius: 1.5, px: 1.5, py: 0.75,
                  }}>
                    <Typography sx={{ fontSize: 10, color: "#F69E3D", fontFamily: "'JetBrains Mono', monospace", textAlign: "center" }}>
                      SHOW AT<br />KIOSK
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Pay button */}
              {job.status === "pending-payment" && (
                <Button variant="contained" fullWidth sx={{ mt: 2 }}
                  onClick={() => navigate(`/main/payment/${job.jobId}`)}>
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
