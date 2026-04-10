import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Stack,
  CircularProgress
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

type HistoryJob = {
  jobId: string;
  fileName: string;
  pageRanges: number[];
  colorMode: string;
  status: string; // includes "collected"
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
      const username =
        paramUsername || localStorage.getItem("username");

      if (!username) throw new Error("No username");

      const res = await fetch(`/api/queue/${username}`);

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();

      // ✅ ONLY collected jobs
      const collected = data.filter(
        (job: HistoryJob) => job.status === "collected"
      );

      // optional: latest first
      collected.sort(
        (a: HistoryJob, b: HistoryJob) =>
          (b.collectedAt || 0) - (a.collectedAt || 0)
      );

      setJobs(collected);
    } catch (err) {
      console.error(err);
      setError("Could not load history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [paramUsername]);

  const formatTime = (t?: number) =>
    t ? new Date(t).toLocaleString() : "N/A";

  return (
    <Container maxWidth="sm">
      <Box minHeight="70vh" py={4}>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" mb={2}>
          <Typography variant="h5">Print History</Typography>
          <Button variant="outlined" onClick={fetchJobs}>
            Refresh
          </Button>
        </Stack>

        {/* Loading */}
        {loading && (
          <Stack alignItems="center" py={4}>
            <CircularProgress />
            <Typography variant="body2" mt={1}>
              Loading history…
            </Typography>
          </Stack>
        )}

        {/* Error */}
        {!loading && error && (
          <Typography color="error">{error}</Typography>
        )}

        {/* Empty */}
        {!loading && !error && jobs.length === 0 && (
          <Typography color="text.secondary">
            No history yet
          </Typography>
        )}

        {/* List */}
        {!loading &&
          jobs.map((job) => (
            <Paper key={job.jobId} sx={{ p: 2, mb: 2 }}>
              <Stack spacing={1}>
                <Typography fontWeight={600}>
                  {job.fileName}
                </Typography>

                <Typography variant="body2">
                  Pages: {job.pageRanges.length}
                </Typography>

                <Typography variant="body2">
                  Color: {job.colorMode}
                </Typography>

                <Typography variant="body2">
                  Collected: {formatTime(job.collectedAt)}
                </Typography>
              </Stack>
            </Paper>
          ))}

        {/* Back */}
        <Box mt={3} textAlign="center">
          <Button variant="contained" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default HistoryPage;