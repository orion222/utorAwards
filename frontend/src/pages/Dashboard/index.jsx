import { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Box, useMediaQuery, FormControl, InputLabel, OutlinedInput, FormHelperText, IconButton, Button, Alert, Link } from "@mui/material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import WalletIcon from '@mui/icons-material/Wallet';
import WavingHandIcon from '@mui/icons-material/WavingHand';
import theme from '../../theme.js';
import EventCard from "../../components/common/EventCard";
import PromotionCard from "../../components/common/PromotionCard";
import TransactionItemCard from "../../components/common/TransactionItemCard.jsx";
import { TheatersOutlined } from "@mui/icons-material";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

function Dashboard() {
    const { user } = useUser();
    const { cookies } = useUser();
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [promotions, setPromotions] = useState([]);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        async function fetchData() {
          try {
            const { data: transactionData } = await api.get("/users/me/transactions", {
                params: {limit: 3}
            });

            const { data: eventData } = await api.get("/events", {
                params: {limit: 3}
            });
            
            const { data: promotionData } = await api.get("/promotions", {
                params: {limit: 3}
            });
            setPromotions(promotionData.results);
            setEvents(eventData.results);
            setTransactions(transactionData.results);
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        }
        fetchData();
    }, []);
   
    const viewWallet = () => {
        navigate("/wallet");
    };

    const viewPromotions = (e) => {
        e.preventDefault();
        navigate("/promotions");
    };

    const viewTransactions = (e) => {
        e.preventDefault();
        navigate("/transactions");
    };

    const viewEvents = (e) => {
        e.preventDefault();
        navigate("/events");
    };

    const isSmall = useMediaQuery("(max-width: 670px)");

    return (
      <Box sx={{bgcolor: theme.palette.background.default}}>
        <Box sx={{padding: "16px"}}>
            <Typography sx={{fontSize: 14}}>
                    <WavingHandIcon sx={{fontSize: 14, paddingRight: "8px"}}/>
                    Welcome back, {user.name}!
            </Typography>
            <Typography sx={{fontSize: 20}}>
                Here's your point summary
            </Typography>
            <Typography sx={{fontSize: 40, fontWeight: 'bold'}}>
                {user.points} points
            </Typography>
            <Button variant="contained" onClick={viewWallet} sx={{fontSize: 12, p: 1 }}>
                <WalletIcon sx={{fontSize: 16, mr: 1 }} />
                View My Wallet
                <ArrowForwardIcon sx={{fontSize: 16, ml: 1 }}/>
            </Button>
        </Box>
        <Box sx={{padding: "16px"}}>
            <Box sx={{display: "flex", flexDirection: "column", gap: "10px"}}>
                <Typography sx={{fontSize: 24}}>
                    Recent Transactions
                </Typography>
                <Box>
                    {transactions.length > 0 ? (
                                transactions.map(transaction => (
                                    <TransactionItemCard transaction={transaction} key={transaction.id}></TransactionItemCard>
                                ))
                            ) : (
                                <Typography>No transactions found.</Typography>
                            )}
                </Box>
                <Link href="/transactions" onClick={viewTransactions} underline='none' sx={{color: theme.palette.text.disabled}}>
                    (View all transactions)
                </Link>
            </Box>
        </Box>
        <Box sx={{padding: "16px"}}>
            <Box sx={{display: "flex", flexDirection: "column", gap: "10px"}}>
                <Typography sx={{fontSize: 24}}>
                    Promotions For You
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: isSmall ? "column" : "row", gap: 1 }}>
                    {promotions.length > 0 ? (
                                    promotions.map(promotion => (
                                        <PromotionCard promotion={promotion} key={promotion.id}></PromotionCard>
                                    ))
                                ) : (
                                    <Typography>No promotions found.</Typography>
                                )}
                </Box>
                <Link href="promotions" onClick={viewPromotions} underline='none' sx={{color: theme.palette.text.disabled, fontSize: 15}}>
                    (View all promotions)
                </Link>
            </Box>
        </Box>
        <Box sx={{padding: "16px"}}>
            <Box sx={{display: "flex", flexDirection: "column", gap: "10px"}}>
                <Typography sx={{fontSize: 24}}>
                    Upcoming Events
                </Typography>
                <Box sx={{display: "flex", flexDirection: isSmall ? "column" : "row", gap: 1, width: "auto"}}>
                        {events.length > 0 ? (
                            events.map(event => (
                                    <EventCard event={event} key={event.id}></EventCard>
                            ))
                        ) : (
                            <Typography>No events found.</Typography>
                        )}        
                </Box>
               
                <Link href="events" onClick={viewEvents} underline='none' sx={{color: theme.palette.text.disabled}}>
                    (View all events)
                </Link>
            </Box>
        </Box>
      </Box>
    );
}


export default Dashboard;
