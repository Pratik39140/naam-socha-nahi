
import { useNavigate } from "react-router-dom";
import { Container, Stack, Typography, Button } from "@mui/material";

const ProfilePage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("logged_in");
    navigate("/login", { replace: true });
  };

  return (
    <Container maxWidth="sm" sx={{ paddingY: 4 }}>
      <Stack spacing={2}>
        <Typography variant="h5">Profile Placeholder Page</Typography>

        <Button variant="contained" onClick={handleLogout}>
          Logout
        </Button>
      </Stack>
    </Container>
  );
};

export default ProfilePage;
