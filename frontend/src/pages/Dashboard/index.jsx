import { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import './style.css'

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
            
            const { data: promotionData } = await api.get("/users/me/promotions", {
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
    console.log(events);
    return <div>
        <div className="user-header">
            <p className="welcome-message">Welcome back, {user.name}!</p>
            <p className="point-summary">Here's your point summary</p>
            <p className="points">{user.points} points</p>
            <button type="submit" className="view-wallet-button" onClick={viewWallet}>View My Wallet</button>
        </div>
        <div className="transactions-container">
            <div>
                <p>Recent Transactions</p>
                <div className="transaction-list">
                    {transactions.length > 0 ? (
                                transactions.map(t => (
                                    <div className="transaction-card">
                                        <div className="transaction-left">
                                            <div className="tag-container">
                                                <p>{t.type}</p>
                                                <p>{t.processed ? "Processed" : "Unproccessed"}</p>
                                            </div>
                                            <p>Remark: {t.remark}</p>
                                        </div>
                                        <div className="transaction-right">
                                            <p>{t.amount ? (t.amount) : (t.earned)}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No transactions found.</p>
                            )}
                </div>
                <a href="/transactions" onClick={viewTransactions}>(View all transactions)</a>
            </div>
        </div>
        <div className="promotions-container">
            <div>
                <p>Promotions For You</p>
                <div className="promotion-list">
                    {promotions.length > 0 ? (
                                    promotions.map(p => (
                                        <div className="promotion-card">
                                            <div className="promotion-left">
                                                <div className="tag-container">
                                                    <p>{p.name}</p>
                                                    <p>{p.description}</p>
                                                </div>
                                                <p>Remark: {p.startTime}</p>
                                            </div>
                                            <div className="promotion-right">
                                                <p>{p.points} points</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No promotions found.</p>
                                )}
                </div>
                <a href="promotions" onClick={viewPromotions}>(View all promotions)</a>
            </div>
        </div>
        <div className="events-container">
            <div>
                <p>Upcoming Events</p>
                <div className="event-list">
                          {events.length > 0 ? (
                                events.map(e => (
                                    <div className="event-card">
                                        <div className="event-left">
                                            <div className="tag-container">
                                                <p>{e.name}</p>
                                                <p>{e.description}</p>
                                            </div>
                                            <p>Remark: {e.startTime}</p>
                                        </div>
                                        <div className="event-right">
                                            <p>{e.points} points</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No events found.</p>
                            )}
                </div>
                <a href="events" onClick={viewEvents}>(View all events)</a>
            </div>
        </div>
    </div>;
}

export default Dashboard;
