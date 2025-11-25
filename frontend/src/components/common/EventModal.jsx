import { Card, CardContent, Stack, Chip, Box, Typography, Accordion, AccordionSummary, useMediaQuery, useTheme, AccordionDetails, Divider, Button, Modal } from "@mui/material";
import theme from '../../theme.js';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { TheatersOutlined } from "@mui/icons-material";
import { useState, useEffect } from "react";
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useUser } from "../../context/UserContext";
import api from "../../api/api";


function EventModal({ event, onClose, onRsvp, onUnRsvp }) {
    const isSmall = useMediaQuery("(max-width: 670px)");
    const { id, name, description, location, startTime, endTime, capacity, numGuests, points} = event;
    const [rsvp, setRSVP] = useState(false);

    useEffect(() => {
        async function getMyEvents() {
          try {
            const { data: eventData } = await api.get("users/me/events", {
                params: {limit: 3}
            });

            const idList = eventData.results.map(obj => obj.id);
            
            if (idList.includes(id)) setRSVP(true);

          } catch (error) {
            console.error("Error fetching data:", error);
          }
        }
        getMyEvents();
    }, []);

    const formatDate = (isoDate) => {
        const formattedDate = new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric'
          }).format(new Date(isoDate));
          return formattedDate;
    }

    const rsvpForEvent = () => {
        async function fetchData() {
            try {
                const { data: rsvpData } = await api.post(`events/${id}/guests/me`, {});
                onClose();
                onRsvp();
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
                onClose();
                onUnRsvp();
            } catch (error) {
              console.error("Error un-rsvp'ing for event:", error);
            }
          }
          fetchData();
    }

    return (
        <Box sx={{backgroundColor: "#fff", borderRadius: "8px", boxShadow: 3, width: "35%", height: "auto", backgroundColor: theme.palette.background.paper,
            display: "flex", flexDirection: "column", gap: "0px"
        }}>
            <Box sx={{ position: "relative" }}>
                <CloseIcon onClick={onClose} sx={{ fontSize: 16, position: "absolute", top: 4, right: 4, ":hover": {cursor: "pointer"}}}></CloseIcon>
            </Box>
            <Box sx={{padding: "16px", display: "flex", flexDirection: "row", justifyContent: "space-between", gap: "24px"}}>
                <Box sx={{display: "flex", flexDirection: "column", width: "auto", justifyContent: "space-between", gap: "8px"}}> {/* left side */}
                        <Box sx={{display: "flex", flexDirection: "column", gap: "4px"}}>
                            <Typography sx={{fontSize: 20, fontWeight:"bold"}}>
                                {name}
                            </Typography>
                            <Box sx={{display: "flex", flexDirection: "row", gap: "8px", alignItems: "center"}}>
                                <CalendarTodayIcon sx={{fontSize: 14, color: theme.palette.text.secondary}}/>
                                <Typography sx={{fontSize: 11, color: theme.palette.text.secondary}}> 
                                    {formatDate(startTime)} - {formatDate(endTime)}
                                </Typography>
                            </Box>
                            <Box sx={{display: "flex", flexDirection: "row", gap: "8px", alignItems: "center"}}>
                                <LocationPinIcon sx={{fontSize: 14, color: theme.palette.text.secondary}}/>
                                <Typography sx={{fontSize: 11, color: theme.palette.text.secondary}}>  
                                    {location}
                                </Typography>
                            </Box>
                            <Typography sx={{fontSize: 11, width: "100%", height: "auto", minHeight: "115px"}}>
                                {(description)}
                            </Typography>
                        </Box>
                        <Box>
                            {!rsvp && (<Button onClick={rsvpForEvent} sx={{color: "black", bgcolor: theme.palette.secondary.main, display: "flex", flexDirectoin: "row", justifyContent: "space-between"}}>
                                <ArrowDropDownIcon sx={{fontSize: 12}}></ArrowDropDownIcon>
                                <Typography sx={{fontSize: 12}}>RSVP</Typography>
                            </Button>
                            )}
                            {rsvp && (<Button onClick={unRsvpForEvent} sx={{color: "black", bgcolor: theme.palette.secondary.main, display: "flex", flexDirectoin: "row", justifyContent: "space-between"}}>
                                <ArrowDropDownIcon sx={{fontSize: 12}}></ArrowDropDownIcon>
                                <Typography sx={{fontSize: 12}}>Cancel RSVP</Typography>
                            </Button>
                            )}
                        </Box>
                    </Box>
                    <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between',}}> {/* right side */}
                        <Typography sx={{fontSize: 20, fontWeight: "bold"}}>
                            {points} pts
                        </Typography>
                        <Box sx={{display: "flex", flexDirection: "row", gap: "8px", alignItems: "center"}}>
                            <PeopleAltIcon sx={{fontSize: 14, color: theme.palette.text.secondary}}/>
                            <Typography sx={{fontSize: 11, color: theme.palette.text.secondary}}>
                                {numGuests}/{capacity}
                            </Typography>
                        </Box>
                </Box>
            </Box>
        </Box> 
    )
}

export default EventModal;
