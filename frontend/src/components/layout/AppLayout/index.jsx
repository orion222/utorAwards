import { Outlet } from "react-router-dom";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Box from "@mui/material/Box";

function AppLayout() {
  return (
    <Box
      sx={{
        display: "flex",
      }}
    >
      <Box>
        <Header />
        <Sidebar />
      </Box>
      <Outlet />
    </Box>
  );
}

export default AppLayout;
