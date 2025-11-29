import { Card, CardContent, Stack, Chip, Modal, Box, Typography, Accordion, AccordionSummary, useMediaQuery, useTheme, AccordionDetails, Divider, Button } from "@mui/material";
import theme from '../../theme.js';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import StarIcon from '@mui/icons-material/Star';
import SellIcon from '@mui/icons-material/Sell';
import PaidIcon from '@mui/icons-material/Paid';
import { TheatersOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import EditPromotionModal from "./EditPromotionModal.jsx";
import { useState } from "react";
import { FiEdit } from "react-icons/fi";

function PromotionCard({ promotion, hover, editable = false, refetch = null }) {
    const navigate = useNavigate();
    const isSmall = useMediaQuery("(max-width: 670px)");
    const {name, description, type, endTime, rate, points} = promotion;
    const [editModal, setEditModal ] = useState(false);

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
                    {rate ? ( <Box sx={{display: "flex", flexDirection: "row", gap: "8px", alignItems: "center"}}>
                            <StarIcon sx={{fontSize: 11, color: theme.palette.custom.accent}}/>
                            <Typography sx={{fontSize: 11, color: theme.palette.custom.accent}}>
                                +{rate*100}% Boosted Rate
                            </Typography>
                    </Box>) : (
                            <Box></Box>
                    )}
                    {points ? ( <Box sx={{display: "flex", flexDirection: "row", gap: "8px", alignItems: "center"}}>
                            <PaidIcon sx={{fontSize: 11, color: theme.palette.custom.accent}}/>
                            <Typography sx={{fontSize: 11, color: theme.palette.custom.accent}}>
                                {points} Bonus Points
                            </Typography>
                    </Box>) : (
                        <Box></Box>
                    )}
                    <Box sx={{display: "flex", flexDirection: "row", gap: "8px", alignItems: "center"}}>
                            <CalendarTodayIcon sx={{fontSize: 14, color: theme.palette.text.secondary}}/>
                            <Typography sx={{fontSize: 11, color: theme.palette.text.secondary}}> 
                                Until {formatDate(endTime)}
                            </Typography>
                    </Box>
                    <Typography sx={{fontSize: 11, color: theme.palette.text.secondary}}> 
                        {description}
                    </Typography>
                    {editable && (
                        <Button
                            startIcon={<FiEdit color="grey" />}
                            onClick={() => setEditModal(true)}
                            sx={{
                            fontSize: 12,
                            color: "grey",
                            borderRadius: "8px",
                            width: "fit-content",
                            }}
                        >
                            Edit
                        </Button>
                    )}
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
                        <EditPromotionModal
                            promotion={promotion}
                            onClose={() => setEditModal(false)}
                            refetch={refetch}
                        />
                        </Box>
                    </Modal>
                </Box>
                <Box> {/* right side */}
                    <Chip 
                        label={type.toUpperCase()}
                        size="medium"
                        sx={{
                            fontWeight: 600,
                            fontSize: "0.9rem",
                        }} 
                    />
                </Box>
        </Box>
    )
}

export default PromotionCard;