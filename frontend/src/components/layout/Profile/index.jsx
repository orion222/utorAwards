import { useState } from "react";
import { Menu, MenuItem, ListItemIcon, ListItemText, Avatar } from "@mui/material";
import { User, Settings, LogOut, Bell } from "lucide-react";
import { useUser } from "../../../context/UserContext";
import { useNavigate } from "react-router-dom";
import ProfileModal from "./ProfileModal";
import SettingsModal from "./SettingsModal";
import useToast from "../../common/hooks/useToast";

export default function Profile() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const { showToast, ToastComponent } = useToast();
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    setProfileModalOpen(true);
    handleClose();
  };

  const handleNotifications = () => {
    // e.g. navigate("/notifications");
    handleClose();
  };

  const handleSettings = () => {
    setSettingsModalOpen(true);
    handleClose();
  };

  const handleLogout = () => {
    handleClose();
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <Avatar src={user?.avatarURL} alt="Profile photo" sx={{ width: 32, height: 32, cursor: "pointer" }} onClick={handleOpen}>
        {user?.utorid.charAt(0).toUpperCase()}
      </Avatar>

      {profileModalOpen && (
        <ProfileModal user={user} open={profileModalOpen} onClose={() => setProfileModalOpen(false)} showToast={showToast} />
      )}

      {settingsModalOpen && (
        <SettingsModal open={settingsModalOpen} onClose={() => setSettingsModalOpen(false)} showToast={showToast} />
      )}

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={handleProfile}>
          <ListItemIcon>
            <User size={18} />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </MenuItem>

        <MenuItem onClick={handleNotifications}>
          <ListItemIcon>
            <Bell size={18} />
          </ListItemIcon>
          <ListItemText primary="Notifications" />
        </MenuItem>

        <MenuItem onClick={handleSettings}>
          <ListItemIcon>
            <Settings size={18} />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </MenuItem>

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogOut size={18} />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </MenuItem>
      </Menu>
      
      {ToastComponent}
    </>
  );
}