import { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import api from "../../api/api";
import { useNavigate, useParams } from "react-router-dom";
import {Card, CardContent, Stack, Chip, Box, Typography, Accordion, AccordionSummary, useMediaQuery, useTheme, AccordionDetails, Divider, Button, Modal,} from "@mui/material";
import theme from '../../theme.js';
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationPinIcon from "@mui/icons-material/LocationPin";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import RSVPSuccessModal from "../../components/common/RSVPSuccessModal.jsx";
import UnRSVPSuccessModal from "../../components/common/UnRSVPSuccessModal.jsx";


function EventDetails() {
    const isSmall = useMediaQuery("(max-width: 670px)");
    const { eventId } = useParams();
    const [ event, setEvent ] = useState(null);
    const [rsvp, setRSVP] = useState(false);
    const [rsvpSuccess, setRsvpSuccess] = useState(false);
    const [unRsvpSuccess, setUnRsvpSuccess] = useState(false);
    
    const formatDate = (isoDate) => {
        const formattedDate = new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }).format(new Date(isoDate));
        return formattedDate;
      };

    useEffect(() => {
        async function fetchEvent() {
          try {
            const { data: eventData } = await api.get(`/events/${eventId}`, {
                params: {limit: 3}
            });
            setEvent(eventData);

            const { data: myEvents } = await api.get("users/me/events", {
                params: {limit: 3}
            });

            const idList = myEvents.results.map(obj => obj.id);
            if (idList.includes(eventData.id)) setRSVP(true);

          } catch (error) {
            console.error("Error fetching event:", error);
          }
        }
        fetchEvent();
    }, [eventId]);
    
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
    }

    const unRsvpForEvent = () => {
        async function fetchData() {
            try {
                const { data: rsvpData } = await api.delete(`events/${id}/guests/me`, {});
                setUnRsvpSuccess(true);
                setRSVP(false);
            } catch (error) {
              console.error("Error un-rsvp'ing for event:", error);
            }
          }
          fetchData();
    }

    if (!event) return <p>Loading...</p>;
    const {id, name, description, location, startTime, endTime, capacity, numGuests, points} = event;

    return (
            <Box
            sx={{
                width: "auto",
                height: "auto",
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
            }}
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
                <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <Typography sx={{ fontSize: isSmall ? 20 : 35, fontWeight: "bold" }}>
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
                        sx={{ fontSize: isSmall ? 14 : 24, color: theme.palette.text.secondary }}
                    />
                    <Typography
                        sx={{ fontSize: isSmall ? 11: 18, color: theme.palette.text.secondary }}
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
                    sx={{ fontSize: isSmall ? 14 : 24, color: theme.palette.text.secondary }}
                    />
                    <Typography
                    sx={{ fontSize: isSmall ? 11 : 18, color: theme.palette.text.secondary }}
                    >
                    {location}
                    </Typography>
                </Box>
                <Typography
                    sx={{
                    fontSize: isSmall ? 11 : 18,
                    width: "100%",
                    height: "auto",
                    }}
                >
                    {description}
                </Typography>
                <Box>
                    {!rsvp && (<Button onClick={rsvpForEvent} sx={{color: "black", bgcolor: theme.palette.secondary.main, display: "flex", flexDirectoin: "row", justifyContent: "space-between"}}>
                        <ArrowDropDownIcon sx={{fontSize: isSmall ? 11 : 18}}></ArrowDropDownIcon>
                        <Typography sx={{fontSize: isSmall ? 11 : 18}}>RSVP</Typography>
                    </Button>
                    )}
                    {rsvp && (<Button onClick={unRsvpForEvent} sx={{color: "black", bgcolor: theme.palette.secondary.main, display: "flex", flexDirectoin: "row", justifyContent: "space-between"}}>
                        <ArrowDropDownIcon sx={{fontSize: isSmall ? 11 : 18}}></ArrowDropDownIcon>
                        <Typography sx={{fontSize: isSmall ? 11 : 18}}>Cancel RSVP</Typography>
                    </Button>
                    )}
                </Box>

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
                </Box>
                
            </Box>
            <Box
                sx={{
                width: "auto",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                }}
            >
                {" "}
                {/* right side */}
                <Typography sx={{ fontSize: isSmall ? 20 : 35, fontWeight: "bold" }}>
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
                    sx={{ fontSize: isSmall ? 14 : 24, color: theme.palette.text.secondary }}
                />
                <Typography
                    sx={{ fontSize: isSmall ? 11 : 18, color: theme.palette.text.secondary }}
                >
                    {capacity === null ? `${numGuests}` : `${numGuests}/${capacity}`}
                </Typography>
                </Box>
            </Box>
            </Box>
)
}

export default EventDetails;