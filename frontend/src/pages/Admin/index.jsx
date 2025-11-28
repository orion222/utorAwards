import { Box, Tab, Tabs, Typography } from "@mui/material";
import { Outlet, Link, useLocation, Navigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

function Admin() {
  const location = useLocation();

  if (location.pathname === "/admin")
    return <Navigate to="users" />;

  return (
    <>
      <Typography variant="h4" gutterBottom>Admin</Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Manage users and transactions within the platform.
      </Typography>
      <Tabs value={location.pathname}>
          <Tab label="Users" value="/admin/users" component={Link} to="/admin/users" />
          <Tab label="Transactions" value="/admin/transactions" component={Link} to="/admin/transactions" />
      </Tabs>
      <Box>
        <Outlet />
      </Box>
    </>
  );
}

export default Admin;