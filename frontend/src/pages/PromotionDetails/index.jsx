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
import PromotionCard from "../../components/common/PromotionCard";


function PromotionDetails() {
    const { promotionId } = useParams();
    const [ promotion, setPromotion ] = useState();
    const isSmall = useMediaQuery("(max-width: 670px)");

    useEffect(() => {
        async function fetchPromotion() {
          try {
            const { data: promotionData } = await api.get(`/promotions/${promotionId}`, {
                params: {limit: 3}
            });
            
            setPromotion(promotionData);
           
          } catch (error) {
            console.error("Error fetching event:", error);
          }
        }
        fetchPromotion();
    }, [promotionId]);

    const formatDate = (isoDate) => {
        const formattedDate = new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric'
          }).format(new Date(isoDate));
          return formattedDate;
    }

    if (!promotion) return <p>Loading...</p>;
    const {name, description, type, endTime, rate, points} = promotion;

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
            }}
            >
                <Box sx={{display: "flex", flexDirection: "column"}}> {/* left side */}
                    <Typography sx={{fontSize: isSmall ? 20: 30, fontWeight:"bold"}}>{name}</Typography>
                    {rate ? ( <Box sx={{display: "flex", flexDirection: "row", gap: "8px", alignItems: "center"}}>
                            <StarIcon sx={{fontSize: isSmall ? 11 : 14, color: theme.palette.custom.accent}}/>
                            <Typography sx={{fontSize: isSmall ? 11 : 14, color: theme.palette.custom.accent}}>
                                +{rate*100}% Boosted Rate
                            </Typography>
                    </Box>) : (
                            <Box></Box>
                    )}
                    {points ? ( <Box sx={{display: "flex", flexDirection: "row", gap: "8px", alignItems: "center"}}>
                            <PaidIcon sx={{fontSize: isSmall ? 11 : 14, color: theme.palette.custom.accent}}/>
                            <Typography sx={{fontSize: isSmall ? 11 : 14, color: theme.palette.custom.accent}}>
                                {points} Bonus Points
                            </Typography>
                    </Box>) : (
                        <Box></Box>
                    )}
                    <Box sx={{display: "flex", flexDirection: "row", gap: "8px", alignItems: "center"}}>
                            <CalendarTodayIcon sx={{fontSize: isSmall ? 14 : 18, color: theme.palette.text.secondary}}/>
                            <Typography sx={{fontSize: isSmall ? 11 : 14, color: theme.palette.text.secondary}}> 
                                Until {formatDate(endTime)}
                            </Typography>
                    </Box>
                    <Typography sx={{fontSize: isSmall ? 11 : 14, color: theme.palette.text.secondary}}> 
                        {description}
                    </Typography>
                </Box>
                <Box> {/* right side */}
                    <Box sx={{backgroundColor: theme.palette.custom.border, borderRadius: "8px", padding: "4px"}}>
                        <Typography sx={{fontSize: isSmall ? 14 : 18, fontWeight:"bold"}}> {type.toUpperCase()}</Typography>
                    </Box>
                </Box>
        </Box>
    )
}

export default PromotionDetails;