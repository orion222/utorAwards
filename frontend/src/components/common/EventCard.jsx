import {
  Stack,
  Box,
  Typography,
  useMediaQuery,
  Button,
  Modal,
  Chip,
} from "@mui/material";
import theme from "../../theme.js";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationPinIcon from "@mui/icons-material/LocationPin";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import api from "../../api/api";
import { useUser } from "../../context/UserContext";

import { useState, useEffect } from "react";
import RSVPSuccessModal from "./RSVPSuccessModal.jsx";
import UnRSVPSuccessModal from "./UnRSVPSuccessModal.jsx";
import { FiEdit } from "react-icons/fi";
import EditEventForm from "../../pages/Events/EditEventForm.jsx";
import ManageEventUsers from "../../pages/Events/ManageEventUsers.jsx";
import { useNavigate } from "react-router-dom";
import FormCard from "./FormCard.jsx";

function EventCard({
  event,
  editable = false,
  detailsPage = true,
  refetch = null,
}) {
  const isSmall = useMediaQuery("(max-width: 670px)");
  const {
    id,
    name,
    description,
    location,
    startTime,
    endTime,
    capacity,
    numGuests,
    points,
  } = event;

  const [rsvpSuccess, setRsvpSuccess] = useState(false);
  const [unRsvpSuccess, setUnRsvpSuccess] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [rsvp, setRSVP] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    async function fetchEvent() {
      try {
        const { data: myEvents } = await api.get("users/me/events", {
          params: { limit: 3 },
        });

        const idList = myEvents.results.map((obj) => obj.id);
        if (idList.includes(event.id)) setRSVP(true);
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    }
    fetchEvent();
  }, []);

  const rsvpForEvent = () => {
    async function fetchData() {
      try {
        const { data: rsvpData } = await api.post(`events/${id}/guests/me`, {});
        setRsvpSuccess(true);
        setRSVP(true);
      } catch (error) {
        console.error("Error rsvp'ing for event:", error);
      }
    }
    fetchData();
  };

  const unRsvpForEvent = () => {
    async function fetchData() {
      try {
        const { data: rsvpData } = await api.delete(
          `events/${id}/guests/me`,
          {},
        );
        setUnRsvpSuccess(true);
        setRSVP(false);
      } catch (error) {
        console.error("Error un-rsvp'ing for event:", error);
      }
    }
    fetchData();
  };

  const formatDate = (isoDate) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).format(new Date(isoDate));
  };

  function truncateStr(str) {
    let truncated = str;
    if (isSmall && str?.length > 20) {
      truncated = str.substring(0, 20) + "...";
    } else if (!isSmall && str?.length > 100) {
      truncated = str.substring(0, 100) + "...";
    }
    return truncated;
  }

  const hasStarted = new Date(startTime) < new Date();

  const handleViewDetails = () => {
    if (!detailsPage) return;
    navigate(`/events/${event.id}`, { state: { event } });
  };

  const isManagerOrSuperuser =
    user.role === "manager" || user.role === "superuser";
  if (isSmall) {
    return (
      <Box
        sx={{
          padding: "16px",
          borderRadius: "8px",
          display: "flex",
          flexDirection: "row",
          gap: "10px",
          justifyContent: "space-between",
          border: 1,
          borderColor: theme.palette.custom.border,
          bgcolor: theme.palette.background.paper,
          "&:hover": detailsPage ? { cursor: "pointer", boxShadow: 4 } : {},
        }}
        onClick={handleViewDetails}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <Typography sx={{ fontSize: 20, fontWeight: "bold" }}>
              {name}
            </Typography>
            <Typography sx={{ fontSize: 20, fontWeight: "bold" }}>
              {points} pts
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "8px",
                alignItems: "center",
              }}
            >
              <CalendarTodayIcon
                sx={{ fontSize: 14, color: theme.palette.text.secondary }}
              />
              <Typography
                sx={{ fontSize: 11, color: theme.palette.text.secondary }}
              >
                {formatDate(startTime)} - {formatDate(endTime)}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "8px",
                alignItems: "center",
              }}
            >
              <LocationPinIcon
                sx={{ fontSize: 14, color: theme.palette.text.secondary }}
              />
              <Typography
                sx={{ fontSize: 11, color: theme.palette.text.secondary }}
              >
                {location}
              </Typography>
            </Box>
            <Typography
              sx={{
                fontSize: 11,
                width: "260px",
                height: isSmall ? "22.5px" : "45px",
              }}
            >
              {truncateStr(description)}
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "8px",
                alignItems: "center",
              }}
            >
              <PeopleAltIcon
                sx={{ fontSize: 14, color: theme.palette.text.secondary }}
              />
              <Typography
                sx={{ fontSize: 11, color: theme.palette.text.secondary }}
              >
                {capacity === null
                  ? `${numGuests}`
                  : `${numGuests}/${capacity}`}
              </Typography>
            </Box>
          </Box>
          <Stack direction="row" spacing={1} alignItems="center">
            {!detailsPage && (
              <Box>
                {!rsvp && (
                  <Button
                    onClick={rsvpForEvent}
                    sx={{
                      color: "black",
                      bgcolor: theme.palette.secondary.main,
                      display: "flex",
                      flexDirectoin: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <ArrowDropDownIcon
                      sx={{ fontSize: isSmall ? 11 : 14 }}
                    ></ArrowDropDownIcon>
                    <Typography sx={{ fontSize: isSmall ? 11 : 14 }}>
                      RSVP
                    </Typography>
                  </Button>
                )}
                {rsvp && (
                  <Button
                    onClick={unRsvpForEvent}
                    sx={{
                      color: "black",
                      bgcolor: theme.palette.secondary.main,
                      display: "flex",
                      flexDirectoin: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <ArrowDropDownIcon
                      sx={{ fontSize: isSmall ? 11 : 14 }}
                    ></ArrowDropDownIcon>
                    <Typography sx={{ fontSize: isSmall ? 11 : 14 }}>
                      Cancel RSVP
                    </Typography>
                  </Button>
                )}
              </Box>
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
                zindex: 1300,
              }}
            >
              <RSVPSuccessModal
                event={event}
                onClose={() => setRsvpSuccess(false)}
              ></RSVPSuccessModal>
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
                zindex: 1300,
              }}
            >
              <UnRSVPSuccessModal
                event={event}
                onClose={() => setUnRsvpSuccess(false)}
              ></UnRSVPSuccessModal>
            </Modal>

            {hasStarted ? (
              <Chip
                label="LIVE"
                size="small"
                sx={{
                  backgroundColor: "#ff4444",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: 10,
                }}
              />
            ) : (
              (editable || isManagerOrSuperuser) && (
                <Button
                  startIcon={<FiEdit color="grey" />}
                  onClick={() => setEditModal(true)}
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
              )
            )}
          </Stack>

          <Modal
            open={editModal}
            onClose={() => setEditModal(false)}
            aria-labelledby="edit-event-modal"
            aria-describedby="edit-event-form"
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
            <FormCard
              width="fit-content"
              showClose={true}
              onClose={() => setEditModal(false)}
              sx={{
                width: "90%",
                maxWidth: "600px",
                maxHeight: "90vh",
                overflow: "auto",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <EditEventForm
                event={event}
                onClose={() => setEditModal(false)}
                refetch={refetch}
                openEditEventModal={() => {
                  setEditModal(false);
                  navigate(`/my-events/${event.id}/edit-users`);
                }}
              />
            </FormCard>
          </Modal>
        </Box>
      </Box>
    );
  } else {
    return (
      <Box
        sx={{
          padding: "16px",
          borderRadius: "8px",
          display: "flex",
          flexDirection: "row",
          gap: "10px",
          justifyContent: "space-between",
          border: 1,
          borderColor: theme.palette.custom.border,
          bgcolor: theme.palette.background.paper,
          flexShrink: 1,
          "&:hover": detailsPage ? { cursor: "pointer", boxShadow: 4 } : {},
        }}
        onClick={handleViewDetails}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "auto",
            justifyContent: "space-between",
            gap: "8px",
          }}
        >
          {" "}
          {/* left side */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <Typography sx={{ fontSize: 20, fontWeight: "bold" }}>
              {name}
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "8px",
                alignItems: "center",
              }}
            >
              <CalendarTodayIcon
                sx={{ fontSize: 14, color: theme.palette.text.secondary }}
              />
              <Typography
                sx={{ fontSize: 11, color: theme.palette.text.secondary }}
              >
                {formatDate(startTime)} - {formatDate(endTime)}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "8px",
                alignItems: "center",
              }}
            >
              <LocationPinIcon
                sx={{ fontSize: 14, color: theme.palette.text.secondary }}
              />
              <Typography
                sx={{ fontSize: 11, color: theme.palette.text.secondary }}
              >
                {location}
              </Typography>
            </Box>
            <Typography
              sx={{
                fontSize: 11,
                maxWidth: "260px",
                height: isSmall ? "22.5px" : "45px",
              }}
            >
              {truncateStr(description)}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} alignItems="center">
            {!detailsPage && (
              <Box>
                {!rsvp && (
                  <Button
                    onClick={rsvpForEvent}
                    sx={{
                      color: "black",
                      bgcolor: theme.palette.secondary.main,
                      display: "flex",
                      flexDirectoin: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <ArrowDropDownIcon
                      sx={{ fontSize: isSmall ? 11 : 14 }}
                    ></ArrowDropDownIcon>
                    <Typography sx={{ fontSize: isSmall ? 11 : 14 }}>
                      RSVP
                    </Typography>
                  </Button>
                )}
                {rsvp && (
                  <Button
                    onClick={unRsvpForEvent}
                    sx={{
                      color: "black",
                      bgcolor: theme.palette.secondary.main,
                      display: "flex",
                      flexDirectoin: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <ArrowDropDownIcon
                      sx={{ fontSize: isSmall ? 11 : 14 }}
                    ></ArrowDropDownIcon>
                    <Typography sx={{ fontSize: isSmall ? 11 : 14 }}>
                      Cancel RSVP
                    </Typography>
                  </Button>
                )}
              </Box>
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
                zindex: 1300,
              }}
            >
              <RSVPSuccessModal
                event={event}
                onClose={() => setRsvpSuccess(false)}
              ></RSVPSuccessModal>
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
                zindex: 1300,
              }}
            >
              <UnRSVPSuccessModal
                event={event}
                onClose={() => setUnRsvpSuccess(false)}
              ></UnRSVPSuccessModal>
            </Modal>
            {hasStarted ? (
              <Chip
                label="LIVE"
                size="small"
                sx={{
                  backgroundColor: "#ff4444",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: 10,
                }}
              />
            ) : (
              (editable || isManagerOrSuperuser) && (
                <Button
                  startIcon={<FiEdit color="grey" />}
                  onClick={() => setEditModal(true)}
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
              )
            )}
          </Stack>
          <Modal
            open={editModal}
            onClose={() => setEditModal(false)}
            aria-labelledby="edit-event-modal"
            aria-describedby="edit-event-form"
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
            <Box
              sx={{
                width: "90%",
                maxWidth: "600px",
                maxHeight: "90vh",
                overflow: "auto",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <EditEventForm
                event={event}
                onClose={() => setEditModal(false)}
                openEditEventModal={() => {
                  setEditModal(false);
                  navigate(`/my-events/${event.id}/edit-users`);
                }}
                refetch={refetch}
              />
            </Box>
          </Modal>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {" "}
          {/* right side */}
          <Typography sx={{ fontSize: 20, fontWeight: "bold" }}>
            {points} pts
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "8px",
              alignItems: "center",
            }}
          >
            <PeopleAltIcon
              sx={{ fontSize: 14, color: theme.palette.text.secondary }}
            />
            <Typography
              sx={{ fontSize: 11, color: theme.palette.text.secondary }}
            >
              {capacity === null ? `${numGuests}` : `${numGuests}/${capacity}`}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }
}

export default EventCard;
