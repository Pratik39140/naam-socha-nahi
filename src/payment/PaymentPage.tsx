import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Alert
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

const PaymentPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [paying, setPaying] = useState<boolean>(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);

        const res = await fetch("/api/queue/user");
        if (!res.ok) {
          throw new Error("Failed to fetch jobs");
        }

        const data: Job[] = await res.json();

        const foundJob = data.find((j) => j.jobId === jobId);

        if (!foundJob) {
          setError("Job not found");
        } else {
          setJob(foundJob);
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [jobId]);

  const calculatePrice = (): number => {
    if (!job) return 0;

    const pages = job.pageRanges.length;
    const pricePerPage = job.colorMode === "bw" ? 2 : 7;

    return pages * pricePerPage;
  };

  const handlePayment = async () => {
    if (!jobId) return;

    try {
      setPaying(true);
      setError(null);

      const res = await fetch("/api/payment/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ jobId })
      });


      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Payment failed");
      }

      // Backend now sets status to "queued"
      // Go back to queue page
      navigate("/main/queue");

    } catch (err: any) {
      setError(err.message || "Payment failed");
    } finally {
      setPaying(false);
    }
  };


  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box mt={5} display="flex" justifyContent="center">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!job) return null;

  return (
    <Box display="flex" justifyContent="center" mt={5}>
      <Card sx={{ width: 420 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Payment Details
          </Typography>

          <Typography>
            <strong>File:</strong> {job.originalFileName}
          </Typography>

          <Typography>
            <strong>Pages:</strong> {job.pageRanges.length}
          </Typography>

          <Typography>
            <strong>Color Mode:</strong>{" "}
            {job.colorMode === "bw" ? "Black & White" : "Color"}
          </Typography>

          <Typography variant="h6" sx={{ mt: 2 }}>
            Total Price: ₹{calculatePrice()}
          </Typography>

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 3 }}
            onClick={handlePayment}
            disabled={paying}
          >
            {paying ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Pay Now"
            )}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PaymentPage;
