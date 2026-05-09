import { useEffect, useState } from "react";
import { Container, Typography, Stack, Box, CircularProgress } from "@mui/material";

type GlobalJob = {
  jobId: string;
  userId: string;
  fileName: string;
  pageRanges: number[];
  colorMode: string;
  status: string;
  createdAt: number;
};

const STATUS_DOT: Record<string, string> = {
  "printing":        "#14b8a6",
  "queued":          "#3b82f6",
  "pending-payment": "#f59e0b",
  "done":            "#22c55e",
};

const GlobalQueuePage = () => {
  const [globalQueue, setGlobalQueue] = useState<GlobalJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/queue/global")
      .then((res) => res.json())
      .then((data) => setGlobalQueue(data))
      .catch((err) => console.error("Failed to fetch global queue:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container maxWidth="sm" sx={{ py: 3, position: "relative", zIndex: 1 }}>
      <Box mb={3}>
        <Typography variant="h6" sx={{ color: "#f1f5f9" }}>Global Queue</Typography>
        <Typography sx={{ fontSize: 12, color: "#475569", fontFamily: "'JetBrains Mono', monospace" }}>
          All active print jobs — live view
        </Typography>
      </Box>

      {loading && (
        <Stack alignItems="center" py={6} gap={2}>
          <CircularProgress size={28} sx={{ color: "#3b82f6" }} />
          <Typography sx={{ fontSize: 13, color: "#475569" }}>Fetching queue…</Typography>
        </Stack>
      )}

      {!loading && globalQueue.length === 0 && (
        <Typography sx={{ color: "#334155", fontSize: 14, textAlign: "center", py: 6 }}>
          Queue is empty
        </Typography>
      )}

      <Stack spacing={1.5}>
        {globalQueue.map((job, i) => (
          <Box key={job.jobId} sx={{
            display: "flex", alignItems: "center", gap: 2,
            p: "12px 16px",
            background: i === 0 ? "#3b82f608" : "#111827",
            border: `1px solid ${i === 0 ? "#3b82f620" : "#1e2d47"}`,
            borderRadius: 2,
          }}>
            {/* Position number */}
            <Typography sx={{
              fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
              color: "#334155", minWidth: 20, textAlign: "center",
            }}>
              {i + 1}
            </Typography>

            {/* Status dot */}
            <Box sx={{
              width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
              background: STATUS_DOT[job.status] ?? "#334155",
              boxShadow: job.status === "printing" ? `0 0 6px ${STATUS_DOT["printing"]}` : "none",
            }} />

            {/* Info */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{
                fontSize: 13, fontWeight: 500, color: "#94a3b8",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {job.userId} — {job.fileName}
              </Typography>
              <Typography sx={{ fontSize: 11, color: "#334155", fontFamily: "'JetBrains Mono', monospace" }}>
                {job.pageRanges?.length ?? "?"} pages · {job.colorMode === "bw" ? "B&W" : "Color"}
              </Typography>
            </Box>

            {/* Status badge */}
            <Typography sx={{
              fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
              color: STATUS_DOT[job.status] ?? "#475569",
              background: `${STATUS_DOT[job.status] ?? "#334155"}15`,
              border: `1px solid ${STATUS_DOT[job.status] ?? "#334155"}30`,
              borderRadius: 1, px: 1, py: 0.25, flexShrink: 0,
            }}>
              {job.status}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Container>
  );
};

export default GlobalQueuePage;
