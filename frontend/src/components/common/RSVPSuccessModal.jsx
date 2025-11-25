import { Card, CardContent, Stack, Chip, Box, Typography, Accordion, AccordionSummary, useMediaQuery, useTheme, AccordionDetails, Divider, Button, Modal } from "@mui/material";
import theme from '../../theme.js';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { TheatersOutlined } from "@mui/icons-material";
import { useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useUser } from "../../context/UserContext";
import api from "../../api/api";


function RSVPSuccessModal({ event, onClose }) {
    const isSmall = useMediaQuery("(max-width: 670px)");
    const { id, name, description, location, startTime, endTime, capacity, numGuests, points} = event;
    const [viewDetails, setViewDetails] = useState(false);

    const formatDate = (isoDate) => {
        const formattedDate = new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric'
          }).format(new Date(isoDate));
          return formattedDate;
    }

    return (
    <Box sx={{backgroundColor: "#fff", borderRadius: "8px", boxShadow: 3, width: isSmall ? "90%" : "25%", height: "auto", backgroundColor: theme.palette.background.paper,
        display: "flex", flexDirection: "column", gap: "8px", padding: "16px"}}>
        
            <Typography sx={{fontSize: 20}}>All Set!</Typography>
            <Typography sx={{fontSize: 16, color: theme.palette.text.secondary}}> You have successfully RSVP'ed for this event</Typography>
            <Box sx={{border: 1, borderColor: theme.palette.custom.border,
            bgcolor: theme.palette.background.paper, display: "grid", flexDirection: "column", gap: "4px", borderRadius: "8px", padding: "8px"}}>
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
            </Box>
            <Box sx={{display: "flex", justifyContent: "flex-end"}}>
                <Button onClick={onClose} sx={{fontSize: 12,
                                padding: "8px", 
                                color: "black",
                                backgroundColor: theme.palette.secondary.main,
                                borderRadius: "8px",
                                width: "fit-content"}}>
                    Done
                </Button>
            </Box>
        
    </Box>
        )
}

export default RSVPSuccessModal;