import { Typography, Tabs, Tab, Box } from "@mui/material";
import {Outlet, Link, useLocation, Navigate} from "react-router-dom";

function Explore() {
  const location = useLocation();

  if (location.pathname === "/explore")
    return <Navigate to="events" />;

  return (
    <>
      <Typography variant="h4">Explore</Typography>
      <Tabs value={location.pathname}>
        <Tab label="Events" value="/explore/events" component={Link} to="/explore/events" />
        <Tab label="Promotions" value="/explore/promotions" component={Link} to="/explore/promotions" />
      </Tabs>
      <Box>
        <Outlet />
      </Box>
    </>
  );
}

export default Explore;