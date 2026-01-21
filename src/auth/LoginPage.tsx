import { useNavigate } from "react-router-dom";
import { Container, Stack, Typography, Button } from "@mui/material";

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    localStorage.setItem("logged_in", "true");
    navigate("/main/upload", { replace: true });
  };

  return (
    <Container 
      maxWidth="sm" 
      sx={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        paddingY: 4 
      }}
    >
      <Stack spacing={3} sx={{ width: '100%', textAlign: 'center' }}>
        <Typography variant="h5">Auth Placeholder – Login Page</Typography>

        <Button variant="contained" onClick={handleLogin} size="large">
          Login
        </Button>
      </Stack>
    </Container>
  );
};

export default LoginPage;