import { useContext, useState, useEffect, createContext } from "react";
import { useCookies } from "react-cookie";
import { jwtDecode } from 'jwt-decode';
import api from "../api/axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [cookies, setCookie, removeCookie] = useCookies(["token"]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkUserLoggedIn = async () => {
            const token = cookies.token;

            if (token) {
                try {
                    const decoded = jwtDecode(token);

                    if (decoded.exp * 1000 < Date.now()) {
                        logout();
                        return;
                    }

                    setUser({ id: decoded.id, role: decoded.role });
                } catch (error) {
                    console.warn("Invalid Token");
                    logout();
                }
            }
        }

        checkUserLoggedIn();
    }, []);

    const logout = async () => {
        removeCookie("token", { path: '/' });
        setUser(null);
    }

    return (
        <UserContext.Provider value={{ user, setUser, logout, cookies, setCookie, removeCookie }}>
            {children}
        </UserContext.Provider>
    );
}

export const UseUser = () => {
    return useContext(UserContext);
}