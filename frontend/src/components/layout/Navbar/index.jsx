import { useState} from "react";
import {
  Box,
  Drawer,
  MenuList,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Tooltip
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar({ isOpen, isMobileWidth, navItems, setIsNavOpen }) {
  const [expandedItems, setExpandedItems] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  const toggleExpand = (id) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const sidebarWidth = isOpen ? 240 : 64;

  const sidebar = (
    <Box
      component="aside"
      sx={{
        width: sidebarWidth,
        backgroundColor: "#E8EBDF",
        borderRight: isMobileWidth ? 0 : "1px solid #ccc",
        padding: 1,
        transition: "width 0.3s",
        mt: 8,
        overflowY: "auto",
        overflowX: "hidden",
        flexShrink: 0,
        position: isMobileWidth ? "static" : "fixed",
        height: "100%",
      }}
    >
      <MenuList sx={{ p: 0 }}>
        {navItems.map((item) => {
          const hasActiveChild = item.children?.some((child) => location.pathname === child.path) || false;

          return (
            <Box key={item.path}>
              <Tooltip title={isOpen ? "" : item.label} placement="right">
                <MenuItem
                  selected={(!item.children && location.pathname === item.path) || hasActiveChild}
                  onClick={() => {
                    if (item.children) {
                      if (isOpen) {
                        toggleExpand(item.path);
                      } else {
                        navigate(item.children[0].path);
                      }
                    } else {
                      navigate(item.path);
                    }
                  }}
                  sx={{
                    minHeight: 48,
                    px: 1,
                    mx: 1,
                    borderRadius: 2,
                    my: 1,
                    justifyContent: isOpen ? "flex-start" : "center",
                    "&.Mui-selected": {
                      backgroundColor: "#CFD4C0",
                      "&:hover": {
                        backgroundColor: "#C2C8B4",
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: isOpen ? 2 : 0,
                      justifyContent: "center",
                    }}
                  >
                    <item.icon/>
                  </ListItemIcon>

                  <ListItemText
                    primary={item.label}
                    sx={{
                      opacity: isOpen ? 1 : 0,
                      transition: "opacity 0.3s",
                      whiteSpace: "nowrap",
                      "& .MuiTypography-root": {
                        fontSize: "0.8rem"
                      }
                    }}
                  />

                  {item.children && isOpen && (
                    expandedItems[item.path] ? <ExpandLess/> : <ExpandMore/>
                  )}
                </MenuItem>
              </Tooltip>

              {item.children && (
                <Collapse in={expandedItems[item.path] && isOpen} timeout="auto">
                  <MenuList sx={{pl: 4, p: 0}}>
                    {item.children.map((child) => (
                      <MenuItem
                        key={child.path}
                        component={Link}
                        to={child.path}
                        selected={location.pathname === child.path}
                        sx={{
                          borderRadius: 2,
                          mx: 1,
                          mb: 0.5,
                          minHeight: 40,
                        }}
                      >
                        <ListItemText
                          primary={child.label}
                          sx={{
                            opacity: isOpen ? 1 : 0,
                            transition: "opacity 0.3s",
                            whiteSpace: "nowrap",
                            "& .MuiTypography-root": {
                              fontSize: "0.8rem"
                            },
                          }}
                        />
                      </MenuItem>
                    ))}
                  </MenuList>
                </Collapse>
              )}
            </Box>
          );
        })}
      </MenuList>
    </Box>
  );

  return (
    <>
      {!isMobileWidth && sidebar}

      {isMobileWidth && (
        <Drawer
          variant="temporary"
          anchor="left"
          open={isOpen}
          onClose={() => setIsNavOpen(false)}
          ModalProps={{ keepMounted: true }}
          slotProps={{
            paper: {
              sx: {
                width: "max-content",
                backgroundColor: "#E8EBDF",
                padding: 1,
                overflowY: "auto",
              },
            },
          }}
        >
          {sidebar}
        </Drawer>
      )}
    </>
  );
}