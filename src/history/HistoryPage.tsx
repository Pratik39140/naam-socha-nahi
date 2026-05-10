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
          <Typography variant="h6" sx={{ color: "#F2F2F2" }}>Print History</Typography>
          <Typography sx={{ fontSize: 12, color: "#B0B3B8", fontFamily: "'JetBrains Mono', monospace" }}>
            {jobs.length} collected job{jobs.length !== 1 ? "s" : ""}
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
          <Typography sx={{ fontSize: 13, color: "#B0B3B8" }}>Loading history…</Typography>
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
          <HistoryIcon sx={{ fontSize: 48, color: "#5E6266" }} />
          <Typography sx={{ color: "#B0B3B8", fontSize: 14 }}>No print history yet</Typography>
          <Button variant="contained" size="small" onClick={() => navigate("/main/upload")}>
            Start Printing
          </Button>
        </Stack>
      )}

      {/* Job Cards */}
      <Stack spacing={2}>
        {!loading && jobs.map((job) => (
          <Box key={job.jobId} sx={{
            background: "#373A3C", border: "1px solid #5E6266",
            borderRadius: 3, p: "18px 20px",
            transition: "border-color 0.2s",
            "&:hover": { borderColor: "#9FA3A7" },
          }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
              <Stack direction="row" alignItems="center" gap={1} sx={{ maxWidth: "70%" }}>
                <CheckCircleOutlineIcon sx={{ fontSize: 16, color: "#22c55e", flexShrink: 0 }} />
                <Typography sx={{
                  fontWeight: 600, fontSize: 14, color: "#F2F2F2",
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

            <Stack direction="row" gap={3} flexWrap="wrap">
              {[
                ["Pages", job.pageRanges.length],
                ["Mode", job.colorMode === "bw" ? "B&W" : "Color"],
                ["Collected", formatTime(job.collectedAt)],
              ].map(([k, v]) => (
                <Box key={String(k)}>
                  <Typography sx={{ fontSize: 10, color: "#5E6266", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase" }}>{k}</Typography>
                  <Typography sx={{ fontSize: 12, color: "#9FA3A7" }}>{v}</Typography>
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
