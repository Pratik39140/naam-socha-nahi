import React from "react";
import { Container, Stack, Typography } from "@mui/material";

const UploadPage: React.FC = () => {
  return(
      <Container maxWidth="sm" sx={{ paddingY: 4 }}>
        <Stack spacing={2}>
          <Typography variant="h5">Upload Placeholder Page</Typography>
          <input type="file" />
        </Stack>
      </Container>
    );
};

export default UploadPage;
