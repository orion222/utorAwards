import './style.css';
import { useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import {PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import Profile from '../Profile';

function Header({ isNavOpen, onToggleNav }) {

  return (
    <Box
      component="header"
      py={1}
      px={2}
      justifyContent="space-between"
      alignItems="center"
      display="flex"
      flexDirection="row"
      sx={{
        backgroundColor: "#E8EBDF",
        color: "#232715",
        boxSizing: "border-box",
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
          {isNavOpen ? <PanelLeftClose /> : <PanelLeftOpen />}
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
