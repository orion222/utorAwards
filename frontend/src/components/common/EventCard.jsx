import { Card, CardContent, Stack, Chip, Box, Typography, Accordion, AccordionSummary, useMediaQuery, useTheme, AccordionDetails, Divider, Button, Modal } from "@mui/material";
import theme from '../../theme.js';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { TheatersOutlined } from "@mui/icons-material";
import { useState } from "react";
import EventModal from "./EventModal.jsx";

function EventCard({ event }) {
    const isSmall = useMediaQuery("(max-width: 670px)");
    const { name, description, location, startTime, endTime, capacity, numGuests, points} = event;
    const [viewDetails, setViewDetails] = useState(false);

    const typeToColour = {
        "purchase": "#7CD93A",
        "redemption": "#F59B66",
        "adjustment": "#F2B84B",
        "event": "#7DA4F2",
        "transfer": "#BBA3E5",
    }

    const formatDate = (isoDate) => {
        const formattedDate = new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric'
          }).format(new Date(isoDate));
          return formattedDate;
    }
    
    function truncateStr(str) {
        let truncated = description;
        if (isSmall && str.length > 20) {
            truncated = str.substring(0 , 20) + "...";
        }
        else if (!isSmall && str.length > 100) {
            truncated = str.substring(0 , 100) + "...";
        }
        return truncated;
    }

    if (isSmall) {
        return (
            <Box sx={{
                padding: "16px",
                borderRadius: "8px",
                display: "flex",
                flexDirection: "row",
                width: isSmall ? "325px" : "33.33%",
                gap: "10px",
                justifyContent: "space-between", 
                border: 1, 
                borderColor: theme.palette.custom.border,
                bgcolor: theme.palette.background.paper}}>
                    <Box sx={{display: "flex", flexDirection: "column", gap: "8px"}}>
                        <Box sx={{display: "flex", flexDirection: "column", gap: "4px"}}>
                            <Typography sx={{fontSize: 20, fontWeight:"bold"}}>
                                {name}
                            </Typography>
                            <Typography sx={{fontSize: 20, fontWeight: "bold"}}>
                                {points} pts
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
                            <Typography sx={{fontSize: 11, width: "260px", height: isSmall ? "22.5px":"45px"}}>
                                {truncateStr(description)}
                            </Typography>
                            <Box sx={{display: "flex", flexDirection: "row", gap: "8px", alignItems: "center"}}>
                                <PeopleAltIcon sx={{fontSize: 14, color: theme.palette.text.secondary}}/>
                                <Typography sx={{fontSize: 11, color: theme.palette.text.secondary}}>
                                    {numGuests}/{capacity}
                                </Typography>
                            </Box>
                        </Box>
                        <Button variant="contained" sx={{fontSize: 12,
                                padding: "8px", 
                                backgroundColor: theme.palette.secondary.main,
                                borderRadius: "8px",
                                width: "fit-content"}}
                                onClick={() => setViewDetails(true)}>      
                                View Details
                        </Button>
                    </Box>
            </Box>
        
        )
    } else {
    return (
            <Box sx={{
                padding: "16px",
                borderRadius: "8px",
                display: "flex",
                flexDirection: "row",
                width: isSmall ? "325px" : "33.33%",
                gap: "10px",
                justifyContent: "space-between", 
                border: 1, 
                borderColor: theme.palette.custom.border,
                bgcolor: theme.palette.background.paper}}>
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
                        <Typography sx={{fontSize: 11, width: "260px", height: isSmall ? "22.5px":"45px"}}>
                            {truncateStr(description)}
                        </Typography>
                    </Box>
                    <Button variant="contained" sx={{fontSize: 12,
                        padding: "8px", 
                        backgroundColor: theme.palette.secondary.main,
                        borderRadius: "8px",
                        width: "fit-content"}}
                        onClick={() => setViewDetails(true)}>      
                        View Details
                    </Button>
                    <Modal
                        open={viewDetails}
                        onClose={() => setViewDetails(false)}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                        sx={{position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)",
                            display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000}}>
                        <EventModal event={event} onClose={() => setViewDetails(false)}></EventModal>
                    </Modal>
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
        )
    }
}

export default EventCard;