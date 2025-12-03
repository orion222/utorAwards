import { IconButton, Chip, Avatar, Box } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DeleteIcon from "@mui/icons-material/Delete";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import { useUser } from "../../context/UserContext.jsx";
import React from "react";
import {
  handleAddAsGuest,
  handleAddAsOrganizer,
  removeOrganizerFromEvent,
  removeGuestFromEvent,
} from "./fetchers.jsx";
import { useToast } from "../../context/ToastContext.jsx";

export default function TableActions({
  refetch = () => null,
  eventId,
  utorid,
  userId,
  is_guest,
  is_organizer,
}) {
  const { showToast } = useToast();
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const { user } = useUser();
  const isManagerOrSuperuser = ["manager", "superuser"].includes(user.role);
  const unenrolledUser = is_guest === false && is_organizer === false;

  const addAsGuestOrOrganizer = async (role, utorid, eventId) => {
    try {
      const fetcher =
        role === "guest" ? handleAddAsGuest : handleAddAsOrganizer;
      const toastColour = role === "guest" ? "success" : "info";
      const status = await fetcher(eventId, utorid);
      if (status === 201) {
        showToast(`Successfully added ${utorid} as a ${role}!`, toastColour);
        refetch();
      } else {
        showToast(`Failed to add ${utorid} as a ${role}.`, "error");
      }
    } catch {
      showToast(`Error adding ${utorid} as a ${role}.`, "error");
    }
  };
  const removeGuestOrOrganizer = async (role, userId, eventId) => {
    try {
      const fetcher =
        role === "guest" ? removeGuestFromEvent : removeOrganizerFromEvent;
      const status = await fetcher(eventId, userId);
      if (status === 204) {
        showToast(`Removed ${utorid} from ${role} list!`, "success");
        refetch();
      } else {
        showToast(`Failed to remove ${utorid} from ${role} list.`, "error");
      }
    } catch {
      showToast(`Error removing ${utorid} from ${role} list.`, "error");
    }
  };
  const unenrolledUserActions = () => {
    return (
      <>
        <IconButton
          size="medium"
          sx={{
            color: "#2e7d32",
            "&:hover": {
              backgroundColor: "#D0F0C0",
            },
          }}
          onClick={() => addAsGuestOrOrganizer("guest", utorid, eventId)}
        >
          <PersonAddIcon fontSize="medium" />
        </IconButton>
        {
          isManagerOrSuperuser && (
            <IconButton
              size="medium"
              sx={{
                color: "#1565c0",
                "&:hover": {
                  backgroundColor: "#ade8f4",
                },
              }}
              onClick={() => addAsGuestOrOrganizer("organizer", utorid, eventId)}
            >
              <SupervisorAccountIcon fontSize="medium" />
            </IconButton>
          )
        }
      </>
    );
  };
  const organizerOrGuestActions = () => {
    if (!isManagerOrSuperuser && is_organizer) return null;
    if (userId === user.id) {
      return (
        <Chip
          avatar={
            user.avatarUrl ? (
              <Avatar src={`${backendURL}/${user.avatarUrl}`} />
            ) : (
              <Avatar>{user.name.charAt(0).toUpperCase()}</Avatar>
            )
          }
          label="ME"
          size="small"
          color="info"
        />
      );
    }

    return (
      <IconButton
        size="medium"
        sx={{
          color: "#c62828",
          "&:hover": {
            backgroundColor: "#ffebee",
          },
        }}
        onClick={() => {
          if (is_guest) {
            removeGuestOrOrganizer("guest", userId, eventId);
          } else if (is_organizer) {
            removeGuestOrOrganizer("organizer", userId, eventId);
          }
        }}
      >
        <DeleteIcon fontSize="medium" />
      </IconButton>
    );
  };
  return unenrolledUser ? unenrolledUserActions() : organizerOrGuestActions();
}
