import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper
} from "@mui/material";
import { useNavigate } from "react-router-dom";

interface PlaceholderPageProps {
  title?: string;
  description?: string;
  showBackButton?: boolean;
}

const HistoryPage: React.FC<PlaceholderPageProps> = ({
  title = "Coming Soon",
  description = "This feature is currently under development.",
  showBackButton = true
}) => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="70vh"
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            textAlign: "center",
            width: "100%"
          }}
        >
          <Typography variant="h4" gutterBottom>
            {title}
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {description}
          </Typography>

          {showBackButton && (
            <Button
              variant="contained"
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default HistoryPage;
