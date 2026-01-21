import React from "react";
import { Container, Stack, Typography } from "@mui/material";

const PaymentPage: React.FC = () => {
  return(
    <Container maxWidth="sm" sx={{ paddingY: 4 }}>
      <Stack spacing={2}>
        <Typography variant="h5">Payment Placeholder Page</Typography>
      </Stack>
    </Container>
  );
};

export default PaymentPage;
