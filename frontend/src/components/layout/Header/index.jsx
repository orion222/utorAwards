import { Box, IconButton, Typography, AppBar, Toolbar } from '@mui/material';
import {PanelLeftClose, PanelLeftOpen} from 'lucide-react';
import Profile from '../Profile';

function Header({ hasNav, isNavOpen, onToggleNav }) {

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: "#E8EBDF",
        color: "#232715",
        boxSizing: "border-box",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {hasNav && (
            <IconButton
              onClick={onToggleNav}
              disableRipple
              sx={{
                background: "none",
                border: "none",
                padding: 0,
                mr: 1,
                color: "#232715",
                "&:hover": { background: "transparent" },
              }}
            >
              {isNavOpen ? <PanelLeftClose /> : <PanelLeftOpen />}
            </IconButton>
          )}
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
      </Toolbar>
    </AppBar>
  );
}

export default Header;
