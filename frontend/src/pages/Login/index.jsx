import { useState } from "react";
import { useUser } from "../../context/UserContext";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";

function Login() {
    const { login } = useUser();
    const [utorid, setUtorid] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        
        try {
            const { data } = await api.post("/auth/tokens", {
                utorid, password
            });

            login(data.token);
            navigate('/dashboard');
        } catch (error) {
            console.warn(error.message);
        }

        setUtorid("");
        setPassword("");
    }

    return (
        <div>
            <form onSubmit={handleLogin}>
                <label htmlFor="utorid">UTORid</label>
                <input id="utorid" name="utorid" type="text" value={utorid} onChange={(e) => setUtorid(e.target.value)} />
                <label htmlFor="password">Password</label>
                <input id="password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;