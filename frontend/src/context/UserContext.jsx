import { useContext, useState, useEffect, createContext } from "react";
import { useCookies } from "react-cookie";
import { jwtDecode } from 'jwt-decode';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [cookies, setCookie, removeCookie] = useCookies(["token"]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUserLoggedIn = async () => {
            const token = cookies.token;

            setLoading(true);

            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }

            try {
                const decoded = jwtDecode(token);

                if (decoded.exp * 1000 < Date.now()) {
                    logout();
                    setLoading(false);
                    return;
                }

                setUser({ id: decoded.id, role: decoded.role });
            } catch (error) {
                console.warn("Invalid Token");
                logout();
            }

            setLoading(false);
        }

        checkUserLoggedIn();
    }, [cookies.token]);

    const login = (tokenValue) => {
        setCookie("token", tokenValue, { path: "/", secure: false, sameSite: 'strict' });

        const decoded = jwtDecode(tokenValue);
        setUser(decoded);
        console.log(user);
    }

    const logout = () => {
        removeCookie("token", { path: '/' });
        setUser(null);
    }

    return (
        <UserContext.Provider value={{ user, login, logout, cookies, setCookie, removeCookie, loading }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => {
    return useContext(UserContext);
}