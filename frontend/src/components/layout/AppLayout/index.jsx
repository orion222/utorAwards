import { Outlet } from "react-router-dom";
import { useState } from "react";
import Header from "../Header";
import Navbar from "../Navbar";
import {Box, useMediaQuery} from "@mui/material";

function AppLayout() {
  const isMobileWidth = useMediaQuery('(max-width:800px)');
  const [isNavOpen, setIsNavOpen] = useState(true);
  return (
    <Box
      sx={{
        display: "flex", flexDirection: "column", height: "100vh"
      }}
    >
      <Header isNavOpen={isNavOpen} onToggleNav={() => setIsNavOpen(!isNavOpen)}/>
      <Box sx={{ display: "flex", flexDirection: "row", height: "100%" }}>
        <Navbar isOpen={isNavOpen} isMobileWidth={isMobileWidth} setIsNavOpen={setIsNavOpen} />
        <Box py={4} px={8}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default AppLayout;
