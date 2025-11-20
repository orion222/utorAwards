import { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Box, FormControl, InputLabel, OutlinedInput, FormHelperText, IconButton, Button, Alert, Link } from "@mui/material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import WalletIcon from '@mui/icons-material/Wallet';
import WavingHandIcon from '@mui/icons-material/WavingHand';
import theme from '../../theme.js';
import EventCard from "../../components/common/EventCard";
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

            const { data: eventData } = await api.get("/users/me/events", {
                params: {limit: 3}
            });
            
            const { data: promotionData } = await api.get("/promotions", {
                params: {limit: 3}
            });
            console.log(promotionData);
            setPromotions(promotionData.results);
            setEvents(eventData.results);
            setTransactions(transactionData.results);
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        }
        fetchData();
    }, [cookies.token]);
   
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

    const formatDate = (isoDate) => {
        const formattedDate = new Intl.DateTimeFormat('en-US', {
            month: 'short', // "Nov"
            day: '2-digit', // "25"
            year: 'numeric' // "2025"
          }).format(new Date(isoDate));
          return formattedDate;
    }
    // console.log(promotions);
    return <Box sx={{bgcolor: theme.palette.background.default}}>
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
            {/* <button type="submit" className="view-wallet-button" onClick={viewWallet}>View My Wallet</button> */}
            <Button variant="contained" onClick={viewWallet} sx={{fontSize: 12, padding: "8px"}}>
                <WalletIcon sx={{fontSize: 12, paddingRight: "8px"}}/>
                View My Wallet
                <ArrowForwardIcon sx={{fontSize: 12, paddingLeft: "8px"}}/>
            </Button>
        </Box>
        <Box sx={{padding: "16px"}}>
            <Box>
                <Typography sx={{fontSize: 24}}>
                    Recent Transactions
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: "16px" }}>
                    {transactions.length > 0 ? (
                                transactions.map(t => (
                                    <Box>
                                        <Box>
                                            <Box>
                                                <Typography>{t.type}</Typography>
                                                <Typography>{t.processed ? "Processed" : "Unproccessed"}</Typography>
                                            </Box>
                                            <Typography>Remark: {t.remark}</Typography>
                                        </Box>
                                        <Box>
                                            <Typography>{t.amount ? (t.amount) : (t.earned)}</Typography>
                                        </Box>
                                    </Box>
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
            <Box>
                <Typography sx={{fontSize: 24}}>
                    Promotions For You
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: "16px" }}>
                    {promotions.length > 0 ? (
                                    promotions.map(p => (
                                        <Box className="promotion-card">
                                            <Box className="promotion-left">
                                                <Box className="tag-container">
                                                    <Typography>{p.name}</Typography>
                                                    <Typography>{p.description}</Typography>
                                                </Box>
                                                <Typography>Remark: {p.startTime}</Typography>
                                            </Box>
                                            <Box className="promotion-right">
                                                <Typography>{p.points} points</Typography>
                                            </Box>
                                        </Box>
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
            <Box>
                <Typography sx={{fontSize: 24}}>
                    Upcoming Events
                </Typography>
                <Box sx={{display: "flex", flexDirection: "row", gap: "16px"}}>
                        {events.length > 0 ? (
                            events.map(e => (
                                <EventCard>
                                    <Box> {/* left side */}
                                        <Box>
                                            <Typography sx={{fontSize: 20, fontWeight:"bold"}}>{e.name}</Typography>
                                            <Box sx={{display: "flex", flexDirection: "row", gap: "8px", alignItems: "center"}}>
                                                <CalendarTodayIcon sx={{fontSize: 14, color: theme.palette.text.secondary}}/>
                                                <Typography sx={{fontSize: 11, color: theme.palette.text.secondary}}> 
                                                    {formatDate(e.startTime)} - {formatDate(e.endTime)}
                                                </Typography>
                                            </Box>
                                            <Box sx={{display: "flex", flexDirection: "row", gap: "8px", alignItems: "center"}}>
                                                <LocationPinIcon sx={{fontSize: 14, color: theme.palette.text.secondary}}/>
                                                <Typography sx={{fontSize: 11, color: theme.palette.text.secondary}}>  
                                                    {e.location}
                                                </Typography>
                                            </Box>
                                            <Typography sx={{fontSize: 11}}>
                                                {e.description}
                                            </Typography>
                                        </Box>
                                        <Button variant="contained" sx={{fontSize: 12,
                                            padding: "8px", 
                                            backgroundColor: theme.palette.secondary.main,
                                            borderRadius: "8px" }}>      
                                            View Details
                                        </Button>
                                    </Box>
                                    <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between',}}> {/* right side */}
                                        <Typography sx={{fontSize: 20, fontWeight: "bold"}}>
                                            {e.points} pts
                                        </Typography>
                                        <Box sx={{display: "flex", flexDirection: "row", gap: "8px", alignItems: "center"}}>
                                            <PeopleAltIcon sx={{fontSize: 14, color: theme.palette.text.secondary}}/>
                                            <Typography sx={{fontSize: 11, color: theme.palette.text.secondary}}>
                                                {e.numGuests}/{e.capacity}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </EventCard>
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
    </Box>;
}

export default Dashboard;
