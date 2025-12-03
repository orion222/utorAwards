import { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import api from "../../api/api";
import { useNavigate, Link } from "react-router-dom";
import { Container, Typography, Box, useMediaQuery, FormControl, InputLabel, OutlinedInput, FormHelperText, IconButton, Button, Alert, Link as MUILink } from "@mui/material";
import WalletIcon from '@mui/icons-material/Wallet';
import WavingHandIcon from '@mui/icons-material/WavingHand';
import theme from '../../theme.js';
import EventCard from "../../components/common/EventCard";
import PromotionCard from "../../components/common/PromotionCard";
import TransactionItemCard from "../../components/common/TransactionItemCard.jsx";
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import RedeemIcon from '@mui/icons-material/Redeem';
import UserCard from "../../components/common/UserCard.jsx";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
// import RSVPSuccessModal from "./RSVPSuccessModal.jsx";
// import UnRSVPSuccessModal from "./UnRSVPSuccessModal.jsx";

function Dashboard() {
    const { user } = useUser();
    const [transactions, setTransactions] = useState([]);
    const [promotions, setPromotions] = useState([]);
    const [events, setEvents] = useState([]);
    const [users, setUsers] = useState([]);
    const [ transactionItem, setTransactionItem] = useState(null);

    useEffect(() => {
        async function fetchData() {
          try {
            const { data: transactionData } = await api.get("/users/me/transactions", {
                params: {limit: 3}
            });
            setTransactions(transactionData.results);

            if (["manager", "superuser"].includes(user.role)) {
                const { data: eventData } = await api.get("/events", {
                    params: {
                        orderBy: "startTime_asc",
                        limit: 3
                    }
                });
                
                const { data: promotionData } = await api.get("/promotions", {
                    params: {limit: 3}
                });

                const { data: userData } = await api.get("/users", {
                    params: {
                        orderBy: "lastLogin_desc",
                        limit: 3
                    }
                });
                setPromotions(promotionData.results);
                setEvents(eventData.results);
                setUsers(userData.results);                
            }

          } catch (error) {
            console.error("Error fetching data:", error);
          }
        }
        
        fetchData();
    }, []);

    const isSmall = useMediaQuery("(max-width: 670px)");

    return (
      <Box sx={{bgcolor: theme.palette.background.default}}>
        <Box sx={{padding: "16px"}}>
            <Typography sx={{fontSize: 14}}>
                <WavingHandIcon sx={{fontSize: 14, paddingRight: "8px"}} />
                Welcome back, {user.name}!
            </Typography>
            <Typography sx={{fontSize: 20}}>
                Here's your point summary
            </Typography>
            <Typography sx={{fontSize: 40, fontWeight: 'bold'}}>
                {user.points} points
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: isSmall ? 'column' : 'row', gap: 1, mt: 2 }}>
                <Button variant="contained" component={Link} to="/wallet/my-qr-code" sx={{fontSize: 12, p: 1 }}>
                    <WalletIcon sx={{fontSize: 16, mr: 1 }} />
                    View My Wallet
                </Button>
                {["cashier", "manager", "superuser"].includes(user.role) && (
                    <>
                        <Button variant="contained" color="secondary" component={Link} to="/create-transaction" sx={{fontSize: 12, p: 1 }}>
                            <ShoppingCartCheckoutIcon sx={{fontSize: 16, mr: 1 }} />
                            Create a transaction
                        </Button>
                        <Button variant="contained" color="secondary" component={Link} to="/redeem-transaction" sx={{fontSize: 12, p: 1 }}>
                            <RedeemIcon sx={{fontSize: 16, mr: 1 }} />
                            Process a redemption
                        </Button>
                    </>
                )}
                {["manager", "superuser"].includes(user.role) && (
                    <>
                        <Button variant="contained" color="secondary" component={Link} to="/admin/users" sx={{fontSize: 12, p: 1 }}>
                            <ManageAccountsIcon sx={{fontSize: 16, mr: 1 }} />
                            Manage users
                        </Button>
                    </>
                )}
            </Box>

        </Box>
        <Box sx={{padding: "16px"}}>
            <Box sx={{display: "flex", flexDirection: "column", gap: "10px"}}>
                <Typography sx={{fontSize: 24}}>
                    Recent Transactions
                </Typography>
                <Box>
                    {transactions.length > 0 ? (
                        transactions.map(transaction => (
                            <TransactionItemCard transaction={transaction} key={transaction.id} onClick={() => setTransactionItem(transaction)}></TransactionItemCard>
                        ))
                    ) : (
                        <Typography>No transactions found.</Typography>
                    )}
                </Box>
                <MUILink component={Link} to="/past-transactions" underline='none' sx={{color: theme.palette.text.disabled}}>
                    (View all transactions)
                </MUILink>
            </Box>
        </Box>
        {["manager", "superuser"].includes(user.role) && (
            <>
                <Box padding={2}>
                    <Box sx={{display: "flex", flexDirection: "column", gap: "10px"}}>
                        <Typography sx={{fontSize: 24}}>
                            Promotions For You
                        </Typography>
                        <Box sx={{ display: 'grid', gridTemplateColumns: {xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)'}, gap: 2 }}>
                            {promotions.length > 0 ? (
                                promotions.map(promotion => (
                                    <PromotionCard promotion={promotion} key={promotion.id}></PromotionCard>
                                ))
                            ) : (
                                <Typography>No promotions found.</Typography>
                            )}
                        </Box>
                        <MUILink component={Link} to="/explore/promotions" underline='none' sx={{color: theme.palette.text.disabled, fontSize: 15}}>
                            (View all promotions)
                        </MUILink>
                    </Box>
                </Box>
                <Box padding={2}>
                    <Box sx={{display: "flex", flexDirection: "column", gap: "10px"}}>
                        <Typography sx={{fontSize: 24}}>
                            Upcoming Events
                        </Typography>
                        <Box sx={{display: 'grid', gridTemplateColumns: {xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)'}, gap: 2 }}>
                                {events.length > 0 ? (
                                    events.map(event => (
                                            <EventCard event={event} key={event.id} ></EventCard>
                                    ))
                                ) : (
                                    <Typography>No events found.</Typography>
                                )}        
                        </Box>
                    
                        <MUILink component={Link} to="/explore/events" underline='none' sx={{color: theme.palette.text.disabled}}>
                            (View all events)
                        </MUILink>
                    </Box>
                </Box>
                <Box padding={2}>
                    <Box sx={{display: "flex", flexDirection: "column", gap: "10px"}}>
                        <Typography sx={{fontSize: 24}}>
                            Recently Active Users
                        </Typography>
                        <Box sx={{display: 'grid', gridTemplateColumns: {xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)'}, gap: 2 }}>
                                {users.length > 0 ? (
                                    users.map(user => (
                                            <UserCard user={user} key={user.id} />
                                    ))
                                ) : (
                                    <Typography>No users found.</Typography>
                                )}        
                        </Box>
                    
                        <MUILink component={Link} to="/admin/users" underline='none' sx={{color: theme.palette.text.disabled}}>
                            (View all users)
                        </MUILink>
                    </Box>
                </Box>
            </>
        )}
      </Box>
    );
}


export default Dashboard;
