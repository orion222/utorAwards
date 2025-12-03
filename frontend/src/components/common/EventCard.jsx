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
import { useNavigate } from "react-router-dom";

function EventCard({
  event,
  detailsPage = true,
}) {
  const isSmall = useMediaQuery("(max-width: 670px)");
  const {
    name,
    description,
    location,
    startTime,
    endTime,
    capacity,
    numGuests,
    points,
  } = event;

  const navigate = useNavigate();


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
  const hasEnded = new Date(endTime) < new Date();

  const handleViewDetails = () => {
    if (!detailsPage) return;
    navigate(`/events/${event.id}`, { state: { event } });
  };
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
            {hasEnded ? (
              <Chip
                label="ENDED"
                size="small"
                sx={{
                  fontWeight: "bold",
                  fontSize: 10,
                }}
              />
            ) : hasStarted ? (
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
            ) : null}
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
