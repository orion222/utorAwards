import { Card, CardContent, Stack, Box, Typography, Accordion, AccordionSummary, useMediaQuery, useTheme, AccordionDetails, Divider, Button } from "@mui/material";
import theme from '../../theme.js';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import StarIcon from '@mui/icons-material/Star';
import SellIcon from '@mui/icons-material/Sell';
import PaidIcon from '@mui/icons-material/Paid';
import { TheatersOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import StatusChip from './StatusChip.jsx'
function PromotionCard({ promotion, hover }) {
    const navigate = useNavigate();
    const isSmall = useMediaQuery("(max-width: 670px)");
    const {name, description, type, endTime, rate, points} = promotion;

    const formatDate = (isoDate) => {
        const formattedDate = new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric'
          }).format(new Date(isoDate));
          return formattedDate;
    }

    const handleViewPromotion = () => {
        navigate(`/promotions/${promotion.id}`, { state: { promotion } });
    };

    const isHover = hover !== undefined ? hover : true;

    return (
        <Box sx={{
            padding: "16px",
            borderRadius: "8px",
            display: "flex",
            flexDirection: "row",
            gap: "5px",
            justifyContent: "space-between", 
            border: 1, 
            borderColor: theme.palette.custom.border,
            bgcolor: theme.palette.background.paper,
            '&:hover': isHover ? { cursor: 'pointer', boxShadow: 4 } :  { cursor: 'default' }
            }}
            onClick={handleViewPromotion}
            >
                <Box sx={{display: "flex", flexDirection: "column"}}> {/* left side */}
                    <Typography sx={{fontSize: 20, fontWeight:"bold"}}>{name}</Typography>
                    {rate && ( <Box sx={{display: "flex", flexDirection: "row", gap: "8px", alignItems: "center"}}>
                            <StarIcon sx={{fontSize: 11, color: theme.palette.custom.accent}}/>
                            <Typography sx={{fontSize: 11, color: theme.palette.custom.accent}}>
                                {Math.round(+rate*100)}% Boosted Rate
                            </Typography>
                    </Box>)}
                    {points && ( <Box sx={{display: "flex", flexDirection: "row", gap: "8px", alignItems: "center"}}>
                            <PaidIcon sx={{fontSize: 11, color: theme.palette.custom.accent}}/>
                            <Typography sx={{fontSize: 11, color: theme.palette.custom.accent}}>
                                {points} Bonus Points
                            </Typography>
                    </Box>)}
                <Box sx={{display: "flex", flexDirection: "row", gap: "8px", alignItems: "center"}}>
                        <CalendarTodayIcon sx={{fontSize: 14, color: theme.palette.text.secondary}}/>
                        <Typography sx={{fontSize: 11, color: theme.palette.text.secondary}}> 
                            Until {formatDate(endTime)}
                        </Typography>
                </Box>
                <Typography 
                    sx={{                
                        fontSize: 11,
                        maxWidth: "260px",
                        height: isSmall ? "22.5px" : "45px",}}
                    > 
                    {description}
                </Typography>
            </Box>
            <Box> {/* right side */}
                <StatusChip
                    label={type.toUpperCase()}
                    sx={{
                        backgroundColor: type === 'automatic' ? '#caf0f8': '#e0f7d7',
                    }} 
                />
            </Box>
        </Box>
    )
}

export default PromotionCard;