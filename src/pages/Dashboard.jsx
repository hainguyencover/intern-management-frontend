import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { Button, Typography, Box } from "@mui/material";

export default function Dashboard() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    window.location.href = "/login";
  };

  return (
    <Box p={3}>
      <Typography variant="h4">Dashboard</Typography>
      <Typography variant="h6" mt={2}>
        Welcome, {user?.username}
      </Typography>

      <Button
        variant="contained"
        color="error"
        sx={{ mt: 3 }}
        onClick={handleLogout}
      >
        Logout
      </Button>
    </Box>
  );
}
