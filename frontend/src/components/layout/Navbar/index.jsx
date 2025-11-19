import { useMemo, useState } from "react";
import { useUser } from "../../../context/UserContext";
import { getNavForRole } from "./NavbarNavConfig";
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Drawer } from "@mui/material";

export default function Navbar({ isOpen, isMobileWidth, setIsNavOpen}) {
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

  function navContent() {
    return (
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
    );
  }

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
        {navContent()}
      </Box>)}

      {!isMobileWidth && isOpen && (
        <Drawer variant="temporary" anchor="left" open={isOpen} onClose={() => setIsNavOpen(false)} ModalProps={{keepMounted: true}}
          slotProps={{
            paper: {
              sx: {
                width: "max-content",
                backgroundColor: "#E8EBDF", // drawer background
                padding: 1,
                pr: 2,
                overflowY: "auto",
              }
            }
          }}>
          {navContent()}
        </Drawer>
      )}
    </>
    
  );
}
