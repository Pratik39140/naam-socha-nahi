import React, { useState } from "react";
import { Container, Stack, Typography, Button, Paper, Divider } from "@mui/material";
import { PaymentService } from "../services/PaymentService";
import { useLocation, useNavigate } from "react-router-dom";

interface JobDetails {
  jobId: string;
  fileName: string;
  pages: number;
  colorMode: string;
  price: number;
}

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Expecting job info passed via navigate("/payment", { state: job })
  const job = location.state as JobDetails | undefined;

  const [loading, setLoading] = useState(false);

  if (!job) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Typography>No job selected for payment.</Typography>
      </Container>
    );
  }

  const handlePayNow = async () => {
    try {
      setLoading(true);

      // Mock of Razorpay here — skip actual integration
      console.log("Mock Razorpay: payment initiated...");

      await PaymentService.pay(job.jobId);

      navigate("/queue", {
        state: { message: "Payment successful. Job added to queue!" }
      });

    } catch (err) {
      console.error(err);
      alert("Payment failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Stack spacing={2}>
        <Typography variant="h5">Review & Pay</Typography>

        <Paper variant="outlined" sx={{ p: 2 }}>
          <Stack spacing={1}>
            <Typography><strong>File:</strong> {job.fileName}</Typography>
            <Typography><strong>Pages:</strong> {job.pages}</Typography>
            <Typography><strong>Color:</strong> {job.colorMode}</Typography>
            <Typography><strong>Price:</strong> ₹{job.price}</Typography>
          </Stack>
        </Paper>

        <Divider />

        <Typography variant="body2" color="text.secondary">
          Mock Razorpay UI — skipping real payment gateway
        </Typography>

        <Button
          variant="contained"
          onClick={handlePayNow}
          disabled={loading}
        >
          {loading ? "Processing..." : "Pay Now"}
        </Button>
      </Stack>
    </Container>
  );
};

export default PaymentPage;
