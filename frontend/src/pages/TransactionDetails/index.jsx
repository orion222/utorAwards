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
import TransactionItemCard from "../../components/common/TransactionItemCard.jsx";


function TransactionDetails() {
    const { transactionId } = useParams();
    const [transaction, setTransaction] = useState();
    const { state } = useLocation();
    console.log(state);

    return (
        <Box>
            {/* <TransactionItemCard>
            transaction={transaction} key={transactionId}
            </TransactionItemCard> */}
        </Box>
    )
}

export default TransactionDetails;