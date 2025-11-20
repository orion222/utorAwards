import { Outlet } from "react-router-dom";
import { useState, useMemo } from "react";
import Header from "../Header";
import Navbar from "../Navbar";
import { Box, useMediaQuery } from "@mui/material";
import { useUser } from "../../../context/UserContext";
import { getNavForRole } from "../Navbar/NavbarNavConfig";


function AppLayout() {
  const isMobileWidth = useMediaQuery('(max-width:800px)');
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [selectedItem, setSelectedItem] = useState("home");

  const { user } = useUser();
  console.log("user in app layout:", user);

  // app layout reads user from stored state and does not rerender like child elements like dashboard
  const navItems = useMemo(() => {
    if (!user) return [];
    return getNavForRole(user.role, user.isOrganizer);
  }, [user]);

  return (
    <Box
      sx={{
        display: "flex", flexDirection: "column", height: "100vh"
      }}
    >
      <Header hasNav={Boolean(user)} isNavOpen={isNavOpen} onToggleNav={() => setIsNavOpen(!isNavOpen)} />
      <>
      {!user && (
        <Box mt={8} py={isMobileWidth ? 1 : 4} px={isMobileWidth ? 2 : 8} width="100%">
          <Outlet />
        </Box>
      )}

      {user && (
        <Box sx={{ display: "flex", flexDirection: "row", height: "100%" }}>
          <Navbar isOpen={isNavOpen} isMobileWidth={isMobileWidth} setIsNavOpen={setIsNavOpen} selectedItem={selectedItem} setSelectedItem={setSelectedItem} navItems={navItems} />
          <Box mt={8} py={isMobileWidth ? 1 : 4} px={isMobileWidth ? 2 : 8} width="100%">
            <Outlet />
          </Box>
        </Box>
      )}
      </>
      
    </Box>
  );
}

export default AppLayout;
