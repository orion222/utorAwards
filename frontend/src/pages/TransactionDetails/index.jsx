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


function TransactionDetails() {
    const { transactionId } = useParams();

    return (
        <Box>
            Transaction {transactionId}
        </Box>
    )
}

export default TransactionDetails;