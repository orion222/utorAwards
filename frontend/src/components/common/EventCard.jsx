import { Card, CardContent, Stack, Chip, Box, Typography, Accordion, AccordionSummary, useMediaQuery, useTheme, AccordionDetails, Divider, Button } from "@mui/material";
import theme from '../../theme.js';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { TheatersOutlined } from "@mui/icons-material";

function EventCard({ event }) {
    const isSmall = useMediaQuery("(max-width: 670px)");
    const { name, description, location, startTime, endTime, capacity, numGuests, points} = event;
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
                width: "325px",
                gap: "5px",
                justifyContent: "space-between", 
                border: 1, 
                borderColor: theme.palette.custom.border}}>
                <Box sx={{display: "flex", flexDirection: "column", width: "auto", justifyContent: "space-between", gap: "4px"}}> {/* left side */}
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
                        <Typography sx={{fontSize: 11, width: "260px", height: "22.5px"}}>
                            {truncateStr(description)}
                        </Typography>
                    </Box>
                    <Button variant="contained" sx={{fontSize: 12,
                        padding: "8px", 
                        backgroundColor: theme.palette.secondary.main,
                        borderRadius: "8px",
                        width: "fit-content"}}>      
                        View Details
                    </Button>
            </Box>
            <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: "auto"}}> {/* right side */}
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
    } else {
        return (
            <Box sx={{
                padding: "16px",
                borderRadius: "8px",
                display: "flex",
                flexDirection: "row",
                width: "375px",
                gap: "10px",
                justifyContent: "space-between", 
                border: 1, 
                borderColor: theme.palette.custom.border}}>
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
                        <Typography sx={{fontSize: 11, width: "260px", height: "45px"}}>
                            {truncateStr(description)}
                        </Typography>
                    </Box>
                    <Button variant="contained" sx={{fontSize: 12,
                        padding: "8px", 
                        backgroundColor: theme.palette.secondary.main,
                        borderRadius: "8px",
                        width: "fit-content"}}>      
                        View Details
                    </Button>
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