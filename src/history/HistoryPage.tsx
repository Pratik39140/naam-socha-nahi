import React, { useEffect, useState } from "react";
import {
  Box, Container, Typography, Button,
  Stack, CircularProgress,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import HistoryIcon from "@mui/icons-material/History";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

type HistoryJob = {
  jobId: string;
  fileName: string;
  pageRanges: number[];
  colorMode: string;
  status: string;
  collectedAt?: number;
};

const HistoryPage: React.FC = () => {
  const [jobs, setJobs] = useState<HistoryJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { username: paramUsername } = useParams<{ username: string }>();
  const navigate = useNavigate();

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const username = paramUsername || localStorage.getItem("username");
      if (!username) throw new Error("No username");
      const res = await fetch(`/api/queue/${username}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      const collected = data
        .filter((job: HistoryJob) => job.status === "collected")
        .sort((a: HistoryJob, b: HistoryJob) => (b.collectedAt || 0) - (a.collectedAt || 0));
      setJobs(collected);
    } catch (err) {
      setError("Could not load history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, [paramUsername]);

  const formatTime = (t?: number) =>
    t ? new Date(t).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "N/A";

  const price = (job: HistoryJob) =>
    job.pageRanges.length * (job.colorMode === "bw" ? 2 : 7);

  return (
    <Container maxWidth="sm" sx={{ py: 3, position: "relative", zIndex: 1 }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h6" sx={{ color: "#f1f5f9" }}>Print History</Typography>
          <Typography sx={{ fontSize: 12, color: "#475569", fontFamily: "'JetBrains Mono', monospace" }}>
            {jobs.length} collected job{jobs.length !== 1 ? "s" : ""}
          </Typography>
        </Box>
        <Button
          variant="outlined" size="small"
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
          <Typography sx={{ fontSize: 13, color: "#475569" }}>Loading history…</Typography>
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
          <HistoryIcon sx={{ fontSize: 48, color: "#1e2d47" }} />
          <Typography sx={{ color: "#475569", fontSize: 14 }}>No print history yet</Typography>
          <Button variant="contained" size="small" onClick={() => navigate("/main/upload")}>
            Start Printing
          </Button>
        </Stack>
      )}

      {/* Job Cards */}
      <Stack spacing={2}>
        {!loading && jobs.map((job) => (
          <Box key={job.jobId} sx={{
            background: "#111827",
            border: "1px solid #1e2d47",
            borderRadius: 3,
            p: "18px 20px",
            transition: "border-color 0.2s",
            "&:hover": { borderColor: "#334155" },
          }}>
            {/* Top row */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
              <Stack direction="row" alignItems="center" gap={1} sx={{ maxWidth: "70%" }}>
                <CheckCircleOutlineIcon sx={{ fontSize: 16, color: "#22c55e", flexShrink: 0 }} />
                <Typography sx={{
                  fontWeight: 600, fontSize: 14, color: "#f1f5f9",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {job.fileName}
                </Typography>
              </Stack>
              <Typography sx={{
                fontSize: 13, fontWeight: 700,
                fontFamily: "'JetBrains Mono', monospace", color: "#22c55e",
              }}>
                ₹{price(job)}
              </Typography>
            </Stack>

            {/* Meta */}
            <Stack direction="row" gap={3} flexWrap="wrap">
              {[
                ["Pages", job.pageRanges.length],
                ["Mode", job.colorMode === "bw" ? "B&W" : "Color"],
                ["Collected", formatTime(job.collectedAt)],
              ].map(([k, v]) => (
                <Box key={String(k)}>
                  <Typography sx={{ fontSize: 10, color: "#334155", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase" }}>{k}</Typography>
                  <Typography sx={{ fontSize: 12, color: "#64748b" }}>{v}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        ))}
      </Stack>
    </Container>
  );
};

export default HistoryPage;
