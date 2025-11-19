import { Outlet } from "react-router-dom";
import { useState } from "react";
import Header from "../Header";
import Navbar from "../Navbar";
import {Box, useMediaQuery} from "@mui/material";

function AppLayout() {
  const isMobileWidth = useMediaQuery('(min-width:800px)');
  const [isNavOpen, setIsNavOpen] = useState(true);
  return (
    <Box
      sx={{
        display: "flex", flexDirection: "column", height: "100vh"
      }}
    >
      <Header isNavOpen={isNavOpen} onToggleNav={() => setIsNavOpen(!isNavOpen)} isMobileWidth={isMobileWidth}/>
      <Box sx={{ display: "flex", flexDirection: isMobileWidth ? "row" : "column", height: "90vh" }}>
        <Navbar isOpen={isNavOpen} isMobileWidth={isMobileWidth} />
        <Box p={4}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default AppLayout;
