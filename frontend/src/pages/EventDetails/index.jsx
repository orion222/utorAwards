import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useParams, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Modal from "@mui/material/Modal";
import LinearProgress from "@mui/material/LinearProgress";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationPinIcon from "@mui/icons-material/LocationOn";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { FiEdit } from "react-icons/fi";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EventBusyIcon from "@mui/icons-material/EventBusy";

import DetailsTemplate from "../../components/common/DetailsTemplate.jsx";
import FormCard from "../../components/common/FormCard";
import EditEventForm from "../../pages/Events/EditEventForm.jsx";
import RSVPSuccessModal from "../../components/common/RSVPSuccessModal";
import UnRSVPSuccessModal from "../../components/common/UnRSVPSuccessModal";
import { useUser } from "../../context/UserContext.jsx";
import api from "../../api/api";
import { useToast } from "../../context/ToastContext.jsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import EventStatusChip from "../Events/EventStatusChip.jsx";

// Define the content component in the same file
function EventDetailsContent({ data, refetch, rsvpSuccess, setRsvpSuccess, unRsvpSuccess, setUnRsvpSuccess }) {
  const { showToast } = useToast();
  const theme = useTheme();
  const { user } = useUser();
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [editModal, setEditModal] = useState(false);
  const [rsvp, setRSVP] = useState(data?.guests?.some((item) => item.user.id === user.id) || false);

  const formatDate = (dateIsoString) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).format(new Date(dateIsoString));
  };

  const rsvpMutation = useMutation({
    mutationFn: async () => {
      return api.post(`events/${id}/guests/me`, {});
    },
    onSuccess: () => {
      setRsvpSuccess(true);
      setRSVP(true);
      queryClient.invalidateQueries({ queryKey: ["event-details", String(id)] })
      queryClient.invalidateQueries({ queryKey: ["my-event-invitations"] })
    },
    onError: (error) => {
      showToast(error.response?.data?.error || "An unknown error occurred.", "error");
      console.error("Error rsvp'ing for event:", error);
    }
  });

  const unRsvpMutation = useMutation({
    mutationFn: async () => {
      return api.delete(`events/${id}/guests/me`, {});
    },
    onSuccess: () => {
      setUnRsvpSuccess(true);
      setRSVP(false);
      queryClient.invalidateQueries({ queryKey: ["event-details", String(id)] });
      queryClient.invalidateQueries({ queryKey: ["my-event-invitations"] })
    },
    onError: (error) => {
      showToast(error.response?.data?.error || "An unknown error occurred.", "error");
      console.error("Error un-rsvp'ing for event:", error);
    }
  });

  const isSmall = useMediaQuery("(max-width: 670px)");
  const isManagerOrSuperuser = ["manager", "superuser"].includes(user.role);
  const isOrganizer = data.organizers.some((organizer) => organizer.id === user.id);

  if (!data) return null;
  const { startTime, endTime } = data;
  const hasEnded = new Date(endTime) < new Date();

  return (
    <Box sx={{ my: 3, display: "flex", flexDirection: "column", gap: 3 }}>
      <Typography variant="h4" fontWeight="bold">
        {data.name} ({data.points} pts)
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "row", gap: { xs: 1, sm: 3 }, flexWrap: "wrap" }}>
        <Typography variant="subtitle1" color="text.secondary">
          Event ID: {data.id}
        </Typography>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <CalendarTodayIcon sx={{ color: theme.palette.text.secondary }} />
          <Typography variant="subtitle1" color="text.secondary">
            {`${formatDate(data.startTime)} - ${formatDate(data.endTime)}`}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <LocationPinIcon sx={{ color: theme.palette.text.secondary }} />
          <Typography variant="subtitle1" color="text.secondary">
            {data.location}
          </Typography>
        </Box>
      </Box>

      <Stack direction="row" gap={1} alignItems="center">
        <EventStatusChip startTime={data.startTime} endTime={data.endTime} published={data.published} />
        {(isOrganizer || isManagerOrSuperuser) && !hasEnded &&
          <Button
            startIcon={<FiEdit color="grey" />}
            onClick={(e) => {
              e.stopPropagation();
              setEditModal(true);
            }}
            sx={{
              fontSize: 12,
              color: "grey",
              borderRadius: "8px",
              width: "fit-content",
              "&:hover": { backgroundColor: theme.palette.action.hover },
            }}
          >
            Edit
          </Button>
          }
        {!isOrganizer && !hasEnded && (
          <Box>
            {!rsvp ? (
              <Button
                onClick={() => rsvpMutation.mutate()}
                sx={{
                  color: "black",
                  bgcolor: theme.palette.secondary.main,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <EventAvailableIcon sx={{ fontSize: isSmall ? 16 : 17, mr: 0.5 }} />
                <Typography sx={{ fontSize: isSmall ? 11 : 14 }}>
                  RSVP
                </Typography>
              </Button>
            ) : (
              <Button
                onClick={() => unRsvpMutation.mutate()}
                sx={{
                  color: "black",
                  bgcolor: theme.palette.secondary.main,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <EventBusyIcon sx={{ fontSize: isSmall ? 16 : 17, mr: 0.5 }} />
                <Typography sx={{ fontSize: isSmall ? 11 : 14 }}>
                  Cancel RSVP
                </Typography>
              </Button>
            )}
          </Box>
        )}
      </Stack>

      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Description
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "row", gap: "8px", alignItems: "center", mb: 1 }}>
          <PeopleAltIcon sx={{ fontSize: 14, color: theme.palette.text.secondary }} />
          <Typography variant="body2" color="text.secondary">
            {data.capacity === null
              ? `${data.numGuests}`
              : `${data.numGuests}/${data.capacity}`}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {data.description}
        </Typography>
        {(isManagerOrSuperuser || isOrganizer) && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 3 }}>
            <LinearProgress
              variant="determinate"
              value={data.points ? (data.pointsAwarded / data.points) * 100 : 0}
              sx={{
                width: "35%",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: theme.palette.custom.accent,
                },
                backgroundColor: theme.palette.custom.primaryNeutral,
              }}
            />
            <Typography variant="body2" color="text.secondary">
              {data.pointsAwarded}/{data.points} points awarded
            </Typography>
          </Box>
        )}
      </Box>

      <Divider />
      <Typography variant="h6" fontWeight="bold">Organizers</Typography>
      <List sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)", md: "repeat(4, 1fr)" }, gap: 2 }}>
        {data.organizers.map((user, index) => (
          <ListItem
            key={index}
            sx={{
              bgcolor: "background.paper",
              mb: 1,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <ListItemAvatar>
              <Avatar src={user.avatarUrl ? `${backendURL}/${user.avatarUrl}` : undefined} />
            </ListItemAvatar>
            <ListItemText primary={user.name} secondary={user.utorid} />
          </ListItem>
        ))}
      </List>

      {(isOrganizer || isManagerOrSuperuser) && (
        <>
          <Divider />
          <Typography variant="h6" fontWeight="bold">Guest List</Typography>
          <List sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)", md: "repeat(4, 1fr)" }, gap: 2 }}>
            {data.guests.map((item, index) => (
              <ListItem
                key={index}
                sx={{
                  bgcolor: "background.paper",
                  mb: 1,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <ListItemAvatar>
                  <Avatar src={item.user.avatarUrl ? `${backendURL}/${item.user.avatarUrl}` : undefined} />
                </ListItemAvatar>
                <ListItemText primary={item.user.name} secondary={item.user.utorid} />
              </ListItem>
            ))}
          </List>
        </>
      )}

      <Modal
        open={rsvpSuccess}
        onClose={() => setRsvpSuccess(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1300,
        }}
      >
        <RSVPSuccessModal
          event={data}
          onClose={() => setRsvpSuccess(false)}
        />
      </Modal>
      <Modal
        open={unRsvpSuccess}
        onClose={() => setUnRsvpSuccess(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1300,
        }}
      >
        <UnRSVPSuccessModal
          event={data}
          onClose={() => setUnRsvpSuccess(false)}
        />
      </Modal>
      <Modal
        open={editModal}
        onClose={(e) => {
          e.stopPropagation();
          setEditModal(false);
        }}
        aria-labelledby="edit-event-modal"
        aria-describedby="edit-event-form"
        sx={{
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1300,
          padding: 0,
        }}
      >
        <FormCard
          width={'600px'}
          showClose={true}
          onClose={() => setEditModal(false)}
          sx={{
            maxWidth: "600px",
            maxHeight: "90vh",
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
          }}
          keepForm={true}
        >
          <EditEventForm
            event={data}
            onClose={() => setEditModal(false)}
            refetch={refetch}
            openEditEventModal={() => {
              setEditModal(false);
              navigate(`/my-events/${data.id}/edit-users`);
            }}
          />
        </FormCard>
      </Modal>
    </Box>
  );
}

function EventDetails() {
  const [rsvpSuccess, setRsvpSuccess] = useState(false);
  const [unRsvpSuccess, setUnRsvpSuccess] = useState(false);

  return (
    <DetailsTemplate queryKey="event-details" apiEndpoint={`/events`}>
      {(data, refetch) => (
        <EventDetailsContent
          data={data}
          refetch={refetch}
          rsvpSuccess={rsvpSuccess}
          setRsvpSuccess={setRsvpSuccess}
          unRsvpSuccess={unRsvpSuccess}
          setUnRsvpSuccess={setUnRsvpSuccess}
        />
      )}
    </DetailsTemplate>
  );
}

export default EventDetails;
