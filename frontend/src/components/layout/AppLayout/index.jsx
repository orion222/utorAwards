import { Outlet } from "react-router-dom";
import { useState } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Box from "@mui/material/Box";

function AppLayout() {
  const [isNavOpen, setIsNavOpen] = useState(true);
  return (
    <Box
      sx={{
        display: "flex", flexDirection: "column", height: "100vh"
      }}
    >
      <Header isNavOpen={isNavOpen} onToggleNav={() => setIsNavOpen(!isNavOpen)} />
      <Box sx={{ display: "flex", flexDirection: "row", height: "90vh" }}>
        <Sidebar isOpen={isNavOpen} />
        <Box p={4}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default AppLayout;
