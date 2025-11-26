import { Typography, Tabs, Tab, Box } from '@mui/material';
import {Outlet, Link, useLocation, Navigate} from "react-router-dom";
import { useUser } from '../../context/UserContext';

function MyEvents() {
  const location = useLocation();
  const { user } = useUser();

  if (location.pathname === "/my-events")
    return <Navigate to="invitations" />;

  return (
    <>
      <Typography variant="h4">My Events</Typography>
      {(user?.isEventOrganizer || user?.role === "manager" || user?.role === "superuser") && (
        <Tabs value={location.pathname}>
          <Tab label="Invitations" value="/my-events/invitations" component={Link} to="/my-events/invitations" />
          <Tab label="Management" value="/my-events/management" component={Link} to="/my-events/management" />
        </Tabs>
      )}
      <Box>
        <Outlet />
      </Box>
    </>
  );
}

export default MyEvents;