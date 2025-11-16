import { useState } from "react";
import { useUser } from "../../context/UserContext";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import './style.css'

function Dashboard() {
    const { user } = useUser();
    const navigate = useNavigate();

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

    return <div>
        <div className="user-header">
            <p className="welcome-message">Welcome back, {user.name}!</p>
            <p className="point-summary">Here's your point summary</p>
            <p className="points">{user.points} points</p>
            <button type="submit" onClick={viewWallet}>View My Wallet</button>
        </div>
        <div className="transactions-container">
            <div>
                <p>Recent Transactions</p>
                <div>[transactions go here]</div>
                <a href="/transactions" onClick={viewTransactions}>(View all transactions)</a>
            </div>
        </div>
        <div className="promotions-container">
            <div>
                <p>Promotions For You</p>
                <div>[promtions go here]</div>
                <a href="promotions" onClick={viewPromotions}>(View all promotions)</a>
            </div>
        </div>
        <div className="events-container">
            <div>
                <p>Upcoming Events</p>
                <div>[events go here]</div>
                <a href="events" onClick={viewEvents}>(View all events)</a>
            </div>
        </div>
    </div>;
}

export default Dashboard;
