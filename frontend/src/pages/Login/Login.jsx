import { useState } from "react";
import { UseUser } from "../../context/UserContext";
import api from "../../api/axios";
import { jwtDecode } from "jwt-decode";

function Login() {
    const { setCookie, cookies, setUser } = UseUser();
    const [utorid, setUtorid] = useState("");
    const [password, setPassword] = useState("");

    const login = async (utorid, password) => {
        try {
            const { data } = await api.post("/auth/tokens", {
                utorid, password
            });
            setCookie("token", data.token, { path: "/", secure: true, sameSite: 'strict' });

            const decoded = jwtDecode(data.token);
            setUser(decoded);
            console.log(cookies.token)
        } catch (error) {
            console.warn(error.message);
        }
    }

    const handleLogin = (e) => {
        e.preventDefault();
        login(utorid, password);
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