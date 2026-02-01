import React, { useEffect, useState } from "react";
import {
  Container,
  Stack,
  Typography,
  Button,
  CircularProgress,
  Paper
} from "@mui/material";
import { useNavigate } from "react-router-dom";

type QueueJob = {
  jobId: string;
  originalFileName: string;
  pageRanges: number[];
  colorMode: string;
  status: "pending-payment" | "queued" | "printing" | "done";
  createdAt: number;
};

const QueuePage: React.FC = () => {
  const [jobs, setJobs] = useState<QueueJob[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const fetchJobs = async (): Promise<void> => {
  setLoading(true);
  setError(null);

  try {
    const res = await fetch("http://10.92.74.104:3000/queue/user");

    if (!res.ok) {
      throw new Error("Failed to fetch queue");
    }

    const data: QueueJob[] = await res.json();
    setJobs(data);
  } catch (err) {
    console.error(err);
    setError("Could not load queue");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchJobs();
  }, []);

  const formatDate = (timestamp: number): string =>
    new Date(timestamp * 1000).toLocaleString();

  return (
    <Container maxWidth="sm" sx={{ paddingY: 4 }}>
      <Stack spacing={3}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">Your Print Queue</Typography>
          <Button variant="outlined" onClick={fetchJobs}>
            Refresh
          </Button>
        </Stack>

        {loading && (
          <Stack alignItems="center" paddingY={4}>
            <CircularProgress />
            <Typography variant="body2" sx={{ marginTop: 1 }}>
              Loading jobs…
            </Typography>
          </Stack>
        )}

        {!loading && error && (
          <Typography color="error">{error}</Typography>
        )}

        {!loading && !error && jobs.length === 0 && (
          <Typography color="text.secondary">
            No jobs yet
          </Typography>
        )}

        {!loading &&
          jobs.map((job) => (
            <Paper key={job.jobId} sx={{ padding: 2 }}>
              <Stack spacing={1}>
                <Typography variant="subtitle1" fontWeight={600}>
                  {job.originalFileName}
                </Typography>

                <Typography variant="body2">
                  Status: {job.status}
                </Typography>

                <Typography variant="body2">
                  Pages: {job.pageRanges.length}
                </Typography>

                <Typography variant="body2">
                  Color mode: {job.colorMode}
                </Typography>

                <Typography variant="body2">
                  Created: {formatDate(job.createdAt)}
                </Typography>

                {job.status === "pending-payment" && (
                  <Button
                    variant="contained"
                    sx={{ marginTop: 1 }}
                    onClick={() => navigate(`/payment/${job.jobId}`)}
                  >
                    Pay
                  </Button>
                )}

                {job.status === "queued" && (
                  <Typography variant="body2" color="text.secondary">
                    Queue position: —
                  </Typography>
                )}
              </Stack>
            </Paper>
          ))}
      </Stack>
    </Container>
  );
};

export default QueuePage;
