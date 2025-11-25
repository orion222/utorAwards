import { Outlet, useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect, Suspense } from "react";
import Header from "../Header";
import Navbar from "../Navbar";
import { Box, useMediaQuery, CircularProgress } from "@mui/material";
import { useUser } from "../../../context/UserContext";
import { getNavForRole } from "../Navbar/NavbarNavConfig";


function AppLayout() {
  const isMobileWidth = useMediaQuery('(max-width:800px)');
  const [isNavOpen, setIsNavOpen] = useState(true);
  const navigate = useNavigate();

  const { user, cookies } = useUser();

  useEffect(() => {
    if (!cookies.token) 
      navigate("/login");
  }, [cookies.token]);

  useEffect(() => {
    if (isMobileWidth)
      setIsNavOpen(false);
  }, [isMobileWidth]);

  // app layout reads user from stored state and does not rerender like child elements like dashboard
  const navItems = useMemo(() => {
    if (!user) return [];
    return getNavForRole(user?.role, user?.isEventOrganizer);
  }, [user]);

  const loading = (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
      <CircularProgress />
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex", flexDirection: "column", height: "100vh"
      }}
    >
      <Header isNavOpen={isNavOpen} onToggleNav={() => setIsNavOpen(!isNavOpen)} />
        <Box sx={{ display: "flex", flexDirection: "row", height: "100%" }}>
          <Navbar isOpen={isNavOpen} isMobileWidth={isMobileWidth} setIsNavOpen={setIsNavOpen} navItems={navItems} />
          <Box mt={8} ml={isMobileWidth ? 0 : isNavOpen ? "248px" : "82px"} py={isMobileWidth ? 1 : 4} px={isMobileWidth ? 2 : 6} width="100%" height="max-content" sx={{ transition: "margin-left 0.3s",}}>
            <Suspense fallback={loading}>
              <Outlet />
            </Suspense>
          </Box>
        </Box>
    </Box>
  );
}

export default AppLayout;
