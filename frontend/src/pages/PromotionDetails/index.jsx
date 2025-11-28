import { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import api from "../../api/api";
import { useNavigate, useParams, useLocation } from "react-router-dom";
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
    const { state } = useLocation();

    console.log(state);
    return (
        <PromotionCard promotion={state.promotion} key={promotionId} hover={false}></PromotionCard>
    )
}

export default PromotionDetails;