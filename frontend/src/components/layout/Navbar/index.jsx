import { useMemo, useState } from "react";
import { useUser } from "../../../context/UserContext";
import { getNavForRole } from "./NavbarNavConfig";
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, AppBar, Menu, MenuItem } from "@mui/material";

export default function Navbar({ isOpen, isMobileWidth }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const { user } = useUser();
  // const userRole = user ? user.role : null;
  const userRole = "superuser"; //Rrmove this when login is implemented

  const navItems = useMemo(() => {
    return getNavForRole(userRole);
  }, [userRole]);

  // if (!user) {
  //   return null; // maybe a placeholder for unauthenticated users?
  // }

  return (
    <>
      {isMobileWidth && (<Box 
        component="aside"
        sx={{
          width: 'max-content',
          padding: 1,
          pr: 2,
          backgroundColor: "#E8EBDF",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          overflowY: "auto",
        }}
      >
        <List disablePadding component="nav">
          {navItems.map((item, index) => (
            <>
              <ListItem key={item.id} disablePadding>
                <ListItemButton selected={selectedItem === item.id} onClick={() => setSelectedItem(item.id)} sx={{ justifyContent: isOpen ? 'flex-start' : 'center' }}>
                  <ListItemIcon sx={{ minWidth: 0, mr: isOpen ? 3 : 'auto', justifyContent: 'center' }}>
                    <item.icon />
                  </ListItemIcon>
                  {isOpen ? <ListItemText primary={item.label} /> : null}
                </ListItemButton>
              </ListItem>
              {index < navItems.length - 1 && <Divider />}
            </>
          ))}
        </List>
      </Box>)}

      {!isMobileWidth && isOpen && (
        <Box
          component="nav"
          sx={{
            width: "100%",
            backgroundColor: "#E8EBDF",
            borderBottom: "1px solid rgba(0,0,0,0.12)",
          }}
        >
          <List disablePadding>
            {navItems.map((item) => (
              <ListItem key={item.id} disablePadding>
                <ListItemButton
                  selected={selectedItem === item.id}
                  onClick={() => setSelectedItem(item.id)}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <item.icon />
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </>
    
  );
}
