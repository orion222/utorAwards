import { useState } from "react";
import { useUser } from "../../context/UserContext";
import api from "../../api/api";
import { Link, useNavigate } from "react-router-dom";

import './style.css';

function Login() {
    const { login } = useUser();
    const [utorid, setUtorid] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        
        try {
            const { data: authData } = await api.post("/auth/tokens", {
                utorid, password
            });

            const { data: userData } = await api.get("/users/me", {
                headers: {
                    "Authorization": `Bearer ${authData.token}`,
                }
            });

            login(authData.token, userData);
            navigate('/dashboard');
        } catch (error) {
            console.warn(error.response?.data || error.message);
        }

        setUtorid("");
        setPassword("");
    }

    return (
        <div className="center full-screen">
            <div id="login-card">
                <h1>Let's pick up where you left off</h1>
                <span>Sign in to view your points, rewards, and events.</span>
                <form onSubmit={handleLogin}>
                    <div className="form-item">
                        <label htmlFor="utorid">UTORid</label>
                        <input id="utorid" name="utorid" type="text" placeholder="Enter your UTORid" value={utorid} onChange={(e) => setUtorid(e.target.value)} />
                    </div>
                    <div className="form-item">
                        <label htmlFor="password">Password</label>
                        <input id="password" name="password" type="password" placeholder="Enter your password" alue={password} onChange={(e) => setPassword(e.target.value)} />
                        <Link to="/forgotPassword">Forgot your password?</Link>
                    </div>
                    <button type="submit" className="primary-btn">Login</button>
                </form>
            </div>
        </div>
    );
}

export default Login;