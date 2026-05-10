import React, { useEffect, useState } from "react";
import {
  Box, Card, CardContent, Typography,
  Button, CircularProgress, Alert, Stack,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

interface Job {
  jobId: string;
  originalFileName: string;
  pageRanges: number[];
  colorMode: "bw" | "color";
  status: "pending-payment" | "queued" | "printing" | "done";
  createdAt: number;
}

const PrinterSVG: React.FC<{ active: boolean }> = ({ active }) => (
  <svg width="120" height="90" viewBox="0 0 200 130" fill="none" style={{ display: "block", margin: "0 auto" }}>
    <rect x="30" y="40" width="140" height="70" rx="10" fill="#1A1A1A" stroke="#5E6266" strokeWidth="1.5" />
    <rect x="60" y="28" width="80" height="18" rx="4" fill="#1A1A1A" stroke="#5E6266" strokeWidth="1" />
    <rect x="50" y="105" width="100" height="6" rx="3" fill="#1A1A1A" />
    <rect x="65" y="111" width="70" height="4" rx="2" fill="#5E6266" />
    <circle cx="155" cy="62" r="5" fill={active ? "#22c55e" : "#5E6266"}>
      {active && <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite" />}
    </circle>
    <rect x="140" y="72" width="22" height="10" rx="5" fill={active ? "#F69E3D" : "#5E6266"} />
    <rect x="42" y="52" width="80" height="32" rx="4" fill="#1A1A1A" stroke="#5E6266" strokeWidth="1" />
    <text x="82" y="73" fontSize="9" fill={active ? "#F69E3D" : "#5E6266"} textAnchor="middle" fontFamily="monospace">
      {active ? "PROCESSING..." : "READY"}
    </text>
    {active && (
      <>
        <rect x="75" y="100" width="50" height="14" rx="1" fill="#F2F2F2">
          <animate attributeName="y" values="96;104;112" dur="1.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;1;0" dur="1.2s" repeatCount="indefinite" />
        </rect>
        <rect x="80" y="108" width="28" height="2" rx="1" fill="#9FA3A7">
          <animate attributeName="y" values="104;112;120" dur="1.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;1;0" dur="1.2s" repeatCount="indefinite" />
        </rect>
      </>
    )}
  </svg>
);

const PAYMENT_METHODS = [
  { id: "upi",  label: "UPI / QR Code",        sub: "GPay, PhonePe, Paytm",  icon: "📱" },
  { id: "card", label: "Debit / Credit Card",   sub: "Visa, Mastercard, RuPay", icon: "💳" },
  { id: "cash", label: "Cash",                  sub: "Exact change preferred", icon: "💵" },
];

const PaymentPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const username = localStorage.getItem("username");
        const res = await fetch(`/api/queue/${username}`);
        if (!res.ok) throw new Error("Failed to fetch jobs");
        const data: Job[] = await res.json();
        const found = data.find((j) => j.jobId === jobId);
        if (!found) setError("Job not found");
        else setJob(found);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [jobId]);

  const calculatePrice = () => {
    if (!job) return 0;
    return job.pageRanges.length * (job.colorMode === "bw" ? 2 : 7);
  };

  const handlePayment = async () => {
    if (!jobId || !selectedMethod) return;
    try {
      setPaying(true);
      setError(null);
      const res = await fetch("/api/payment/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Payment failed");
      }
      const username = localStorage.getItem("username");
      navigate(`/main/queue/${username}`);
    } catch (err: any) {
      setError(err.message || "Payment failed");
    } finally {
      setPaying(false);
    }
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <CircularProgress />
    </Box>
  );

  if (error && !job) return (
    <Box display="flex" justifyContent="center" mt={6} px={2}>
      <Alert severity="error" sx={{ maxWidth: 400, width: "100%" }}>{error}</Alert>
    </Box>
  );

  if (!job) return null;

  return (
    <Box display="flex" justifyContent="center" alignItems="flex-start"
      sx={{ px: 2, pt: 4, pb: 4, position: "relative", zIndex: 1 }}>
      <Box sx={{ width: "100%", maxWidth: 420 }}>

        <Box mb={3}>
          <Typography variant="h6" sx={{ color: "#F2F2F2", mb: 0.5 }}>Payment</Typography>
          <Typography sx={{ fontSize: 12, color: "#B0B3B8", fontFamily: "'JetBrains Mono', monospace" }}>
            Job ID: {job.jobId.slice(0, 12)}…
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {/* Order Summary Card */}
        <Card sx={{ mb: 2 }}>
          <CardContent sx={{ p: "20px !important" }}>
            <Typography sx={{ fontSize: 11, color: "#B0B3B8", fontFamily: "'JetBrains Mono', monospace", mb: 2, letterSpacing: "0.08em" }}>
              ORDER SUMMARY
            </Typography>

            <PrinterSVG active={paying} />

            <Box sx={{ mt: 2.5 }}>
              {[
                ["File", job.originalFileName],
                ["Pages", job.pageRanges.length],
                ["Color Mode", job.colorMode === "bw" ? "Black & White" : "Color"],
                ["Rate", `₹${job.colorMode === "bw" ? 2 : 7} / page`],
              ].map(([k, v]) => (
                <Box key={String(k)} sx={{
                  display: "flex", justifyContent: "space-between",
                  py: 0.75, borderBottom: "1px solid #5E6266",
                }}>
                  <Typography sx={{ fontSize: 13, color: "#B0B3B8" }}>{k}</Typography>
                  <Typography sx={{
                    fontSize: 13, color: "#9FA3A7", maxWidth: "55%",
                    textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>{v}</Typography>
                </Box>
              ))}
              <Box sx={{ display: "flex", justifyContent: "space-between", pt: 1.5 }}>
                <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#F2F2F2" }}>Total</Typography>
                <Typography sx={{
                  fontSize: 20, fontWeight: 700,
                  fontFamily: "'JetBrains Mono', monospace", color: "#F69E3D",
                }}>
                  ₹{calculatePrice()}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Typography sx={{ fontSize: 11, color: "#B0B3B8", fontFamily: "'JetBrains Mono', monospace", mb: 1.5, letterSpacing: "0.08em" }}>
          SELECT PAYMENT METHOD
        </Typography>
        <Stack spacing={1.5} mb={3}>
          {PAYMENT_METHODS.map((m) => (
            <Box key={m.id} onClick={() => !paying && setSelectedMethod(m.id)}
              sx={{
                display: "flex", alignItems: "center", gap: 2,
                p: "14px 18px", borderRadius: 2, cursor: "pointer",
                background: selectedMethod === m.id ? "#F69E3D10" : "#1A1A1A",
                border: `1.5px solid ${selectedMethod === m.id ? "#F69E3D" : "#5E6266"}`,
                transition: "all 0.15s",
                "&:hover": { borderColor: selectedMethod === m.id ? "#F69E3D" : "#9FA3A7" },
              }}
            >
              <Box sx={{ fontSize: 22, lineHeight: 1 }}>{m.icon}</Box>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: 14, fontWeight: selectedMethod === m.id ? 600 : 400, color: selectedMethod === m.id ? "#F2F2F2" : "#9FA3A7" }}>
                  {m.label}
                </Typography>
                <Typography sx={{ fontSize: 11, color: "#5E6266" }}>{m.sub}</Typography>
              </Box>
              <Box sx={{
                width: 18, height: 18, borderRadius: "50%",
                border: `2px solid ${selectedMethod === m.id ? "#F69E3D" : "#5E6266"}`,
                background: selectedMethod === m.id ? "#F69E3D" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                {selectedMethod === m.id && <Box sx={{ width: 6, height: 6, borderRadius: "50%", background: "#1A1A1A" }} />}
              </Box>
            </Box>
          ))}
        </Stack>

        <Button fullWidth variant="contained" sx={{ py: 1.4 }}
          disabled={paying || !selectedMethod}
          onClick={handlePayment}
        >
          {paying
            ? <><CircularProgress size={18} sx={{ mr: 1.5, color: "#1A1A1A" }} />Processing…</>
            : `Confirm Payment · ₹${calculatePrice()}`
          }
        </Button>
      </Box>
    </Box>
  );
};

export default PaymentPage;
