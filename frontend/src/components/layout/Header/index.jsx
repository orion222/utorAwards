import { Box, IconButton, Typography } from '@mui/material';
import {PanelLeftClose, PanelLeftOpen, PanelTopClose, PanelTopOpen } from 'lucide-react';
import Profile from '../Profile';

function Header({ isNavOpen, onToggleNav, isMobileWidth }) {

  return (
    <Box
      component="header"
      sx={{
        backgroundColor: "#E8EBDF",
        color: "#232715",
        boxSizing: "border-box",
        py: 1,
        px: 2,
        height: 'max-content',
        justifyContent: "space-between",
        alignItems: "center",
        display: "flex",
        flexDirection: "row"
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        
        <IconButton
          onClick={onToggleNav}
          disableRipple
          sx={{
            background: "none",
            border: "none",
            padding: 0,
            color: "#232715",
            "&:hover": { background: "transparent" },
          }}
        > 
          {isMobileWidth && (isNavOpen ? <PanelLeftClose /> : <PanelLeftOpen />)}
          {!isMobileWidth && (isNavOpen ? <PanelTopClose /> : <PanelTopOpen />)}
        </IconButton>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: "#232715",
            userSelect: "none",
          }}
        >
          UTORAwards
        </Typography>

      </Box>

      <Profile />
    </Box>
  );
}

export default Header;
