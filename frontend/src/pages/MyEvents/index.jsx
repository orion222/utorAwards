import { Typography, Tabs, Tab, Box } from "@mui/material";
import { Outlet, Link, useLocation, Navigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

function MyEvents() {
  const location = useLocation();
  const { user } = useUser();
  const tabValue = ["/my-events/invitations", "/my-events/management"].includes(
    location.pathname,
  )
    ? location.pathname
    : false;

  if (location.pathname === "/my-events") return <Navigate to="invitations" />;

  return (
    <>
      <Typography variant="h4">My Events</Typography>
      {(user?.isEventOrganizer ||
        user?.role === "manager" ||
        user?.role === "superuser") &&
        tabValue && (
          <Tabs value={tabValue}>
            <Tab
              label="Invitations"
              value="/my-events/invitations"
              component={Link}
              to="/my-events/invitations"
            />
            <Tab
              label="Management"
              value="/my-events/management"
              component={Link}
              to="/my-events/management"
            />
          </Tabs>
        )}
      <Box>
        <Outlet />
      </Box>
    </>
  );
}

export default MyEvents;
